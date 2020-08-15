import csv
import json


def load_config():
    # 获取数据输出路径和检索词
    config = json.load(open('config.json', 'r', encoding='utf-8'))

    # 处理检索词列表
    searchlist = config['searchlist']
    # 只能传入csv或txt类型
    if type(searchlist) is str:
        if '.csv' in searchlist or '.txt' in searchlist:
            with open(searchlist, 'r', encoding='utf-8-sig') as f:
                if ('.csv' in searchlist):
                    rows = csv.reader(f)
                    searchlist = [row[0].strip() for row in rows]
                if ('.txt' in searchlist):
                    rows = f.readlines()
                    searchlist = [row.strip() for row in rows]
        else:
            searchlist = [searchlist]   # 看作此时仅传入一个词，如'新冠'
    config['searchlist'] = searchlist

    # 处理one_word(字符串转布尔)
    if config['one_word'] == 'True':
        config['one_word'] = True
    elif config['one_word'] == 'False':
        config['one_word'] = False

    return config
