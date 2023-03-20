import os
import torch
import gluonnlp as nlp
import numpy as np
from kobert.utils import get_tokenizer
from kobert.pytorch_kobert import get_pytorch_kobert_model
from BERTDataset import BERTDataset
from BERTClassifier import BERTClassifier

dirname = os.path.dirname(__file__)
modelname = "conversation_model.pt"
filename = os.path.join(dirname, modelname)

class ConversationModel:
    # Setting parameters
    max_len = 64
    batch_size = 64
    warmup_ratio = 0.1
    num_epochs = 10
    max_grad_norm = 1
    log_interval = 200
    learning_rate =  5e-5
    
    def __init__(self):
        if (torch.cuda.is_available()):
           self.device = torch.device("cuda:0");
        else:
          self.device = torch.device("cpu")
        bertmodel, vocab = get_pytorch_kobert_model()
        self.model = BERTClassifier(bertmodel,  dr_rate=0.5).to(self.device)
        self.model_conv = torch.load(filename, map_location=self.device)
        tokenizer = get_tokenizer()
        self.tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)

    def calc_accuracy(self, X,Y):
      max_vals, max_indices = torch.max(X, 1)
      train_acc = (max_indices == Y).sum().data.cpu().numpy()/max_indices.size()[0]
      return train_acc
    
    def softmax(self, a):
      a = a.tolist()
      a.sort()
      a0 = a[0]
      a1 = a[1]
      if a0 < -3 and a1 > 3:
        a0 += 3
        a1 -= 3
      a = [a0, a1]
      print(a)
      exp_a = np.exp(a)
      sum_exp_a = np.sum(exp_a)
      y = exp_a / sum_exp_a

      return y
    
    def predict(self, predict_sentence):
      data = [predict_sentence, '0']
      dataset_another = [data]

      another_test = BERTDataset(dataset_another, 0, 1, self.tok, self.max_len, True, False)
      test_dataloader = torch.utils.data.DataLoader(another_test, batch_size=self.batch_size, num_workers=0)
      
      self.model_conv.eval()

      for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_dataloader):
          token_ids = token_ids.long().to(self.device)
          segment_ids = segment_ids.long().to(self.device)

          valid_length= valid_length
          label = label.long().to(self.device)

          out = self.model_conv(token_ids, valid_length, segment_ids)


          test_eval=[]
          for i in out:
              logits=i
              logits = logits.detach().cpu().numpy()
              # print(logits)
              if np.argmax(logits) == 0:
                  test_eval.append("일반 대화")
              elif np.argmax(logits) == 1:
                  test_eval.append("보이스피싱")
              result = self.softmax(logits)
              
      result_list = result.tolist()
      result_list.sort()
      # print(result_list)
      # print(f">> {result_list[-1]*100}% 확률로 " + test_eval[0] + "입니다.")
      if (test_eval[0] == "일반 대화"):
        print(100 - result_list[-1]*100)
      else:
        print(result_list[-1]*100)
        
