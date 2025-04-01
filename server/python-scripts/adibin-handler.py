import json
import binfilepy
import datetime
import sys

result={}
with binfilepy.BinFile(str(sys.argv[1]), "r") as f:
    # You must read header first before you can read channel data
    f.readHeader()
    header = f.header
    channels = f.channels
    # readChannelData() supports reading in random location (Ex: Read 10 secs of data at 1 min mark)
    data = f.readChannelData(offset=int(sys.argv[2]), length=int(sys.argv[3]), useSecForOffset=True, useSecForLength=True)
    result['StartTime'] = datetime.datetime(header.Year, header.Month, header.Day, header.Hour, header.Minute, int(str( header.Second).split(".")[0]), int(str( header.Second).split(".")[1])).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]
    result['OffsetInSec'] = 0
    result['TicksPerSec'] = 1/header.secsPerTick
    result['SamplesPerChannel'] = header.SamplesPerChannel
    temp = []
    for i in range(len(data)):
        wData = {}
        wData['Channel'] = channels[i].Title
        wData['UOM'] = channels[i].Units
        wData['ID'] = i
        wData['Samples'] = data[i].tolist()
        temp.append(wData)
    result['WaveformData'] = temp
print(json.dumps(result))