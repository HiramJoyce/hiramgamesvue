let Service = {
  getGoBangRooms: getGoBangRooms
};

function loadingData(baseurl, url, sendType, body) {
  let formData = new FormData();
  if (sendType === 'POST') {
    for (let k in body) {
      if (body.hasOwnProperty(k)) {
        formData.append(k, body[k])
      }
    }
  }
  return fetch(baseurl + url, {
    method: sendType,
    mode: 'no-cors',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json', // 'application/x-www-form-urlencoded'
      'Cache-Control': 'no-cache', // 不使用浏览器缓存
      Accept: 'application/json' // 通过头指定，获取的数据类型是JSON
    },
    body: sendType === 'GET' ? null : formData
  })
    .then(response => {
      return response.json()
    })
    .catch(error => {
      return {
        code: 0,
        msg: error.toString()
      }
      // throw error
    })
}

function getGoBangRooms() {
  let baseurl = '';
  let url = 'http://127.0.0.1:8080/api/gobangRooms';
  let sendType = 'GET';
  let body = '';
  return loadingData(baseurl, url, sendType, body)
}
export default Service
