import sys
from Conversation_Model import ConversationModel
from BERTDataset import BERTDataset
from BERTClassifier import BERTClassifier
from Score import Score

if __name__ == "__main__":
    sentence = ''.join(sys.argv[1:])

    model = ConversationModel()
    prob = model.predict(sentence)

    score = Score()
    if prob >= 0.5:
        tokens = score.keyword_select(sentence, True)
    else:
        tokens = score.keyword_select(sentence, False)
    
    print(prob)
    print(tokens)

