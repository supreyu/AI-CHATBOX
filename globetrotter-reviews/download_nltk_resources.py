import json
import nltk
from nltk.corpus import wordnet
import random

# 确保已经下载了NLTK的wordnet和omw-1.4资源
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('punkt')
def synonym_replacement(sentence, num_replacements=1):
    words = nltk.word_tokenize(sentence)  # 使用NLTK的分词方法
    new_words = words.copy()
    random_word_list = list(set([word for word in words if wordnet.synsets(word)]))
    random.shuffle(random_word_list)
    num_replaced = 0
    
    for random_word in random_word_list:
        synonyms = [lem.name() for syn in wordnet.synsets(random_word) for lem in syn.lemmas() if lem.name() != random_word]
        if len(synonyms) > 0:
            synonym = random.choice(synonyms)
            new_words = [synonym if word == random_word else word for word in new_words]
            num_replaced += 1
            if num_replaced >= num_replacements:
                break

    return ' '.join(new_words)

def enhance_dataset(file_path, enhanced_file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    enhanced_data = []
    for item in data:
        enhanced_item = item.copy()  # 复制原始数据项
        original_utterance = item['utterance']
        enhanced_utterance = synonym_replacement(original_utterance)
        enhanced_item['utterance'] = enhanced_utterance
        enhanced_data.append(enhanced_item)

    with open(enhanced_file_path, 'w', encoding='utf-8') as file:
        json.dump(enhanced_data, file, ensure_ascii=False, indent=2)

# 示例使用
file_path = 'processed_data.json'
enhanced_file_path = 'enhanced_processed_data.json'
enhance_dataset(file_path, enhanced_file_path)
