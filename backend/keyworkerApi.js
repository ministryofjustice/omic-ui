const gateway = require('./gateway-api');
const moment = require('moment');
const isoDateFormat = require('./constants').isoDateFormat;

const keyworkerApiUrl = process.env.KEYWORKER_API_URL || 'http://localhost:8081/';

const unallocated = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/offenders/unallocated`,
  headers: { 'Page-Limit': 200 },
  service: 'keyworker'
});

const allocated = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/allocations`,
  headers: { 'Page-Limit': 200 }
});

const autoallocated = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/allocations?allocationType=A&fromDate=${formatDate(req.query.fromDate)}&toDate=${formatDate(req.query.toDate)}`,
  headers: { 'Page-Limit': 200 }
});

const availableKeyworkers = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/available`
});

const getOffenders = (req, res, params, paramsSerializer) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/offenders`,
  params,
  paramsSerializer
});

const keyworker = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.staffId}/agencyId/${req.query.agencyId}`
});

const keyworkerSearch = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/members?nameFilter=${encodeQueryString(req.query.searchText)}`
});

const allocate = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${keyworkerApiUrl}key-worker/allocate`
});

const keyworkerUpdate = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${keyworkerApiUrl}key-worker/${req.query.staffId}/agencyId/${req.query.agencyId}`
});

const autoAllocate = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/allocate/start`
});

const keyworkerAllocations = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.staffId}/agencyId/${req.query.agencyId}/offenders`
});

const service = {
  unallocated, allocated, getOffenders, availableKeyworkers, keyworker, allocate, autoallocated, autoAllocate, keyworkerAllocations, keyworkerSearch, keyworkerUpdate
};

function formatDate (inputDate) {
  return moment(inputDate, 'DD/MM/YYYY').format(isoDateFormat);
}

function encodeQueryString (input) {
  return encodeURIComponent(input);
}

module.exports = service;
