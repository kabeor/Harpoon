import collections
import sys
import tempfile


def allpcaps2dict(pkts, pcapdecode):
    pcaps = collections.OrderedDict()
    for count, i in enumerate(pkts, 1):
        pcaps[count] = pcapdecode.ether_decode(i)
        pcaps[count].update({'id': count})
    return list(pcaps.values())


def filterpcaps2dict(pkts, pcapdecode, key, value):
    pcaps = collections.OrderedDict()
    count = 1
    for p in pkts:
        pcap = pcapdecode.ether_decode(p)
        if key == 'Procotol':
            if value == pcap.get('Procotol').upper():
                pcaps[count] = pcap
                count += 1
            else:
                pass
        elif key == 'Source':
            if len(value.split(':')) == 1:
                if value == pcap.get('Source').upper().split(':')[0]:
                    pcaps[count] = pcap
                    count += 1
            elif len(value.split(':')) == 2:
                if value == pcap.get('Source').upper():
                    pcaps[count] = pcap
                    count += 1
        elif key == 'Destination':
            if len(value.split(':')) == 1:
                if value == pcap.get('Destination').upper().split(':')[0]:
                    pcaps[count] = pcap
                    count += 1
            elif len(value.split(':')) == 2:
                if value == pcap.get('Destination').upper():
                    pcaps[count] = pcap
                    count += 1
        else:
            pass

    return list(pcaps.values())


def filter_pcaps(filter_type, value, pkts, pcapdecode):
    if filter_type == u'All':
        pcaps = allpcaps2dict(pkts, pcapdecode)
    elif filter_type == u'Procotol':
        key = 'Procotol'
        value = str(value).strip().upper()
        pcaps = filterpcaps2dict(pkts, pcapdecode, key, value)
    elif filter_type == u'Source':
        key = 'Source'
        value = str(value).strip().upper()
        pcaps = filterpcaps2dict(pkts, pcapdecode, key, value)
    elif filter_type == u'Destination':
        key = 'Destination'
        value = str(value).strip().upper()
        pcaps = filterpcaps2dict(pkts, pcapdecode, key, value)
    else:
        pcaps = ()
    return pcaps

def showdata_from_id(pkts, dataid):
    pcap = pkts[dataid]
    # 输出重定向数据
    show_temp_name = tempfile.NamedTemporaryFile(prefix='show_', dir='/tmp')
    old = sys.stdout
    show_file = open(show_temp_name.name, 'w')
    sys.stdout = show_file
    pcap.show()
    sys.stdout = old
    show_file.close()
    # 读取数据
    with open(show_temp_name.name, 'r') as showf:
        data = showf.read()
    result = data.strip().split('###')[1:]
    html = '''
            <div class="accordion-group">
                <div class="accordion-heading">
                    <b><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse{id}">
                        {proto}
                    </a></b></br>
                    </div>
                    <div id="collapse{id}" class="accordion-body collapse">
                    <div class="accordion-inner">
                        {values}
                    </div>
                </div>
            </div>
'''
    all_html = ''
    id = 0
    for proto, value in zip(result[::2], result[1::2]):
        id += 1
        html_proto = proto.strip()[1:-1].strip()
        html_values = ''
        values = value.strip().split('\n')
        for v in values:
            val = v.split('  =')
            if len(val) == 2:
                html_values += '<b>{0} = {1}</b></br>'.format(
                    val[0].strip(), val[1].strip())
            elif len(val) == 1:
                html_values += '<b>{0} = {1}</b></br>'.format('options', 'None')
        all_html += html.format(proto=html_proto,
                                values=html_values, id=str(id))
    return all_html