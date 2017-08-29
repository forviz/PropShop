import _ from 'lodash';
import { fetchPolicyAPI, fetchAgreementAPI } from '../api/content';

const POLICY = 'policy';
const AGREEMENT = 'agreement';

const setContentFetching = (content, fetching) => {
  return {
    type: 'CONTENT/FETCHING',
    content,
    fetching,
  };
};

const setContentFetchStatus = (content, fetchStatus) => {
  return {
    type: 'CONTENT/FETCH/STATUS',
    content,
    fetchStatus,
  };
};

const setContentData = (content, data) => {
  return {
    type: 'CONTENT/SET/DATA',
    content,
    data,
  };
};

export const fetchPolicy = () => {
  return async (dispatch) => {
    dispatch(setContentFetching(POLICY, true));
    dispatch(setContentFetchStatus(POLICY, ''));
    dispatch(setContentData(POLICY, ''));
    const result = await fetchPolicyAPI();
    dispatch(setContentFetching(POLICY, false));
    dispatch(setContentFetchStatus(POLICY, 'success'));
    const data = _.get(result, 'data.content');
    dispatch(setContentData(POLICY, data));
  };
};

export const fetchAgreement = () => {
  return async (dispatch) => {
    dispatch(setContentFetching(AGREEMENT, true));
    dispatch(setContentFetchStatus(AGREEMENT, ''));
    dispatch(setContentData(AGREEMENT, ''));
    const result = await fetchAgreementAPI();
    dispatch(setContentFetching(AGREEMENT, false));
    dispatch(setContentFetchStatus(AGREEMENT, 'success'));
    const data = _.get(result, 'data.content');
    dispatch(setContentData(AGREEMENT, data));
  };
};

export default fetchPolicy;
