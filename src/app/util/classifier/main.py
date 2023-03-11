import sys
from Conversation_Model import ConversationModel
from BERTDataset import BERTDataset
from BERTClassifier import BERTClassifier

if __name__ == "__main__":
    sentence = sys.argv[1]

    model = ConversationModel()
    model.predict(sentence)
