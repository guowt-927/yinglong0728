import csv, json, re
from pathlib import Path

SRC=Path(r"C:\Users\wanting\Desktop\新建文件")
OUT=Path(__file__).parent

def read(name):
    with open(SRC/name,'r',encoding='utf-8-sig',newline='') as f:
        return list(csv.DictReader(f))
def f(row,key):
    try:return float(row[key])
    except:return None
def max3(s):
    try:return max(float(x.strip()) for x in s.split('|'))
    except:return None

files={
 'qwen3-32b':('qwen3-32b_online_MTT-S5000_2_1_noapikey.csv','qwen3-32b_offline_MTT-S5000_2_1_noapikey.csv'),
 'qwen3.5-27b':('qwen35-27b_online_MTT-S5000_2_1_noapikey.csv','qwen35-27b_offline_MTT-S5000_2_1_noapikey.csv')}
result={'models':{},'small_models':{}}
for model,(oname,offname) in files.items():
    online=read(oname); offline=read(offname)
    groups={}
    for r in online:
        key=(int(r['输入长度']),int(r['输出长度']))
        groups.setdefault(key,[]).append(r)
    selected=[]
    for key,rows in sorted(groups.items()):
        limit=2 if key[0]<=4096 else 20
        qualified=[r for r in rows if max3(r['首token时延min/avg/max分布']) is not None and max3(r['首token时延min/avg/max分布'])<=limit]
        best=max(qualified,key=lambda r:int(r['并发数'])) if qualified else min(rows,key=lambda r:max3(r['首token时延min/avg/max分布']) or 1e9)
        selected.append({'input':key[0],'output':key[1],'concurrency':int(best['并发数']),
          'ttft_max_s':max3(best['首token时延min/avg/max分布']),'itl_ms':f(best,'平均非首token时延'),
          'throughput_avg':f(best,'总吞吐_avg'),'per_req_avg':f(best,'单并发吞吐_avg'),'limit_s':limit,
          'qualified':best in qualified})
    og={}
    for r in offline:
        key=(int(r['输入长度']),int(r['输出长度']))
        og.setdefault(key,[]).append(r)
    offsel=[]
    for key,rows in sorted(og.items()):
        best=max(rows,key=lambda r:f(r,'总吞吐') or -1)
        offsel.append({'input':key[0],'output':key[1],'concurrency':int(best['并发数']),
          'latency_avg_s':f(best,'并发数对应的时延'),'generation_speed':f(best,'生成速度'),
          'throughput_avg':f(best,'总吞吐'),'per_req_avg':f(best,'单并发吞吐')})
    result['models'][model]={'online':selected,'offline':offsel,'online_rows':len(online),'offline_rows':len(offline)}

for fn,key in [('embedding.csv','embedding'),('reranker.csv','reranker')]:
    rows=read(fn); result['small_models'][key]=rows
(OUT/'analysis.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=True,indent=2))
