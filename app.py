import zipfile

from flask import Flask, request
from flask import jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from pcap_decode import PcapDecode
from filter import *
from proto_analyzer import *
from flow_analyzer import *

PD = PcapDecode()
global pktpath, pkts, pktscache  # './pcap.pcap'
# pktscache = None
pktpath = ''

if pktpath:
    pkts = rdpcap(pktpath)
    pktscache = allpcaps2dict(pkts, PD)
else:
    pktscache = None

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}}, methods=['GET', 'HEAD', 'POST', 'OPTIONS'])


#       pkts filter
@app.route('/api/v1/dashboard/datapkts')
def datapkts():
    pcaps = pktscache  # allpcaps2dict(pkts, PD)
    return jsonify(pcaps)


@app.route('/api/v1/dashboard/pcap_len')
def pcaplen():
    pcap_len = pcap_len_statistic(pkts)
    return jsonify(pcap_len)


#       proto data
@app.route('/api/v1/dashboard/protokind')
def protokind():
    protokind = common_proto_statistic(pkts)
    return jsonify(list(protokind.values()))


@app.route('/api/v1/dashboard/mostproto')
def mostproto():
    mostproto = most_proto_statistic(pkts, PD)
    return jsonify(mostproto)


@app.route('/api/v1/dashboard/httpprotokey')
def httpprotokey():
    http_key_list = list()
    httpproto = http_statistic(pkts)
    httpproto = sorted(httpproto.items(), key=lambda d: d[1], reverse=False)
    for key, value in httpproto:
        http_key_list.append(key)
    return jsonify(http_key_list)


@app.route('/api/v1/dashboard/httpprotovalue')
def httpprotovalue():
    http_value_list = list()
    httpproto = http_statistic(pkts)
    httpproto = sorted(httpproto.items(), key=lambda d: d[1], reverse=False)
    for key, value in httpproto:
        http_value_list.append(value)
    return jsonify(http_value_list)


@app.route('/api/v1/dashboard/dnsprotokey')
def dnsproto_key():
    dns_key_list = list()
    dnsproto = dns_statistic(pkts)
    dnsproto = sorted(dnsproto.items(), key=lambda d: d[1], reverse=False)
    for key, value in dnsproto:
        dns_key_list.append(key[:-1].decode('utf-8'))
    return jsonify(dns_key_list)


@app.route('/api/v1/dashboard/dnsprotovalue')
def dnsproto_value():
    dns_value_list = list()
    dnsproto = dns_statistic(pkts)
    dnsproto = sorted(dnsproto.items(), key=lambda d: d[1], reverse=False)
    for key, value in dnsproto:
        dns_value_list.append(value)

    return jsonify(dns_value_list)


@app.route('/api/v1/dashboard/timeflow_keys')
def timeflow_keys():
    timeflow_dict = time_flow(pkts)
    return jsonify(list(timeflow_dict.keys()))


@app.route('/api/v1/dashboard/timeflow_values')
def timeflow_values():
    timeflow_dict = time_flow(pkts)
    return jsonify(list(timeflow_dict.values()))


@app.route('/api/v1/dashboard/dataflow')
def dataflow():
    dataflow_dict = data_flow(pkts, get_host_ip(pkts))
    return dataflow_dict


@app.route('/api/v1/dashboard/ipflow')
def ipflow():
    ipflow_dict = data_in_out_ip(pkts, get_host_ip(pkts))
    return ipflow_dict


@app.route('/api/v1/dashboard/protoflow')
def protoflow():
    protoflow_dict = proto_flow(pkts)
    return jsonify(list(protoflow_dict.values()))


@app.route('/api/v1/dashboard/mostflow_keys')
def mostflowkeys():
    mostflow_dict = most_flow_statistic(pkts, PD)
    mostflow_dict = sorted(mostflow_dict.items(),
                           key=lambda d: d[1], reverse=True)
    if len(mostflow_dict) > 10:
        mostflow_dict = mostflow_dict[0:10]
    most_flow_key = list()
    for key, value in mostflow_dict:
        most_flow_key.append(key)
    return jsonify(most_flow_key)


@app.route('/api/v1/dashboard/mostflow')
def mostflow():
    mostflow_dict = most_flow_statistic(pkts, PD)
    mostflow_list = sorted(mostflow_dict.items(),
                           key=lambda d: d[1], reverse=True)
    if len(mostflow_list) > 10:
        mostflow_list = mostflow_list[0:10]
    return jsonify(mostflow_list)


@app.route('/api/v1/dashboard/datashow/<dataid>', methods=['POST', 'GET'])
def datashow(dataid):
    dataid = int(dataid) - 1
    data = showdata_from_id(pkts, dataid)
    return data


@app.route('/api/v1/dashboard/filter/<rules>', methods=['POST', 'GET'])
def filterpkt(rules):
    filter_proto, filter_value = rules.split('-')
    pcaps = filter_pcaps(filter_proto, filter_value, pkts, PD)
    return jsonify(pcaps)


UPLOAD_FOLDER = 'upload'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
basedir = os.path.abspath(os.path.dirname(__file__))
ALLOWED_EXTENSIONS = {'pcap'}


# 用于判断文件后缀
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


# 上传文件
@app.route('/upload', methods=['POST'])
@cross_origin()
def api_upload():
    file_dir = os.path.join(basedir, app.config['UPLOAD_FOLDER'])
    if not os.path.exists(file_dir):
        os.makedirs(file_dir)
    f = None
    if request.method == 'POST':
        f = request.files['file']

    if f and allowed_file(f.filename):  # 判断是否是允许上传的文件类型
        fname = secure_filename(f.filename)
        ext = fname.rsplit('.', 1)[1]  # 获取文件后缀
        unix_time = int(time.time())
        new_filename = str(unix_time) + '.' + ext  # 修改了上传的文件名
        f.save(os.path.join(file_dir, new_filename))  # 保存文件到upload目录

        global pktpath, pkts, pktscache
        pktpath = './upload/'+new_filename
        pkts = rdpcap(pktpath)
        pktscache = allpcaps2dict(pkts, PD)
        return jsonify({'name': pktpath, 'status': "done"})
    else:
        return jsonify({"errno": 1001, "errmsg": u"failed", 'status': 'error'})


if __name__ == '__main__':
    app.run()
