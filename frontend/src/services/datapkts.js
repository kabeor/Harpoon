import { get } from '../utils/request'
import axios from 'axios';


/**
 * 获取列表
 * @param {*} page
 */
export function listpktsApi(page = 1) {
  return get("/api/v1/dashboard/datapkts", { page, per: 20 });
}

export function pcaplenApi() {
  return get('/api/v1/dashboard/pcap_len')
}

export function protokindApi() {
  return get('/api/v1/dashboard/protokind')
}

export function mostprotoApi() {
  return get('/api/v1/dashboard/mostproto')
}

export function httpprotokeyApi() {
  return get('/api/v1/dashboard/httpprotokey')
}

export function httpprotovalueApi() {
  return get('/api/v1/dashboard/httpprotovalue')
}

export function dnsprotokeyApi() {
  return get('/api/v1/dashboard/dnsprotokey')
}

export function dnsprotovalueApi() {
  return get('/api/v1/dashboard/dnsprotovalue')
}

export function timeflowkeyApi(){
  return get('/api/v1/dashboard/timeflow_keys')
}

export function timeflowvalueApi(){
  return get('/api/v1/dashboard/timeflow_values')
}

export function dataflowApi(){
  return get('/api/v1/dashboard/dataflow')
}

export function ipflowApi(){
  return get('/api/v1/dashboard/ipflow')
}

export function protoflowApi(){
  return get('/api/v1/dashboard/protoflow')
}

export function mostflow_keysApi(){
  return get('/api/v1/dashboard/mostflow_keys')
}

export function mostflowApi(){
  return get('/api/v1/dashboard/mostflow')
}

const gethtml = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 5000,
  responseType: 'html'
})

export function getpktdatabyidApi(id){
  return gethtml.get('/api/v1/dashboard/datashow/'+id);
}

export function filterpcapApi(rules){
  return get('/api/v1/dashboard/filter/'+rules)
}
