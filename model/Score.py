from mecab import MeCab
import pickle

class Score:
    def __init__(self):
      with open("model/score_dict.pickle","rb") as fr:
        self.score_dict = pickle.load(fr)
          
    def keyword_select(self, sentence, isphishing):
      m = MeCab()
      processed_sentence = m.pos(sentence)

      score_set = set()
      for word in processed_sentence:
        if word[1] in ["NNG", "NNP", "VV", "VA", "MM", "MAG"]:
          if word in self.score_dict.keys():
            score_set.add((word, self.score_dict[word]))
            
      score_list = list(score_set)
      score_list.sort(key=lambda a: a[1], reverse=isphishing)

      score_list = list(map(lambda score: score[0][0], score_list))
      return score_list[0:4]
      