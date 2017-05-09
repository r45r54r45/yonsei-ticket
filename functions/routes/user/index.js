const query = require('../../util/mysql');
const {GET_USER_BUS_HISTORY} = require('./query');
const phantom = require('phantom');
function createPhantom() {
  return new Promise((resolve) => {
    phantom.create()
      .then(ph => {
        _ph = ph;
        resolve(ph);
      })
  })
}
exports.method = {
  POST: (req, res) => {

  },
  GET: (req, res) => {
    switch (req.query.data){
      case 'busHistory':
        const userUID = req.USER_UID;
        query(GET_USER_BUS_HISTORY, [userUID])
          .then(busHistoryList => {
            res.json(busHistoryList);
          });
        break;
      default:
        res.json({
          result: -1,
          error: "wrong access"
        })
    }
  },
}

exports.checkAccount=  (id, pw) => {
  let count = 0;
  let startTime = new Date().getTime();
  let endTime;
  return new Promise((resolve, reject) => {
    let _page;
    let _ph;
    createPhantom().then(ph => {
      _ph = ph;
      return _ph.createPage();
    }).then(page => {
      _page = page;
      _page.on('onLoadFinished', function () {
        count++;
        console.log("loading: " + count);
        if (count === 3) {
          _page.evaluate(function () {
            return document.getElementById('btnLogin').click();
          }).then(function () {
            console.log("first page opened, triggering login button")
          })
        }
        if (count === 5) {
          _page.evaluateJavaScript(
            `
                    function() {
                       return (function(){
                            document.getElementById('loginId').value = '${id}';
                            document.getElementById('loginPasswd').value = '${pw}';
                            document.getElementsByTagName('button')[0].click();
                            })();
                       }`
          ).then(function () {
            console.log("id,pw input finished and login btn clicked")
          })
        }
        if (count === 6) {
          //로그인 폼이 떠있는지 확인
          _page.evaluate(function () {
            return document.getElementById('loginId')
          })
            .then(result => {
                if (result) {
                  console.log("login failed");
                  resolve({code: -1, err: "login failed"})
                }
              }
            )
        }
        if (count === 9) {
          _page.evaluate(function () {
            return document.getElementById('grpLoginData').childNodes[0].innerText
          })
            .then(resultId => {
              console.log("로그인된 아이디는", resultId
              )
              endTime = new Date().getTime();
              _page.close();
              _ph.exit();
              resolve({code: 0, result: resultId === id, duration: (endTime - startTime) / 1000});
              // _page.evaluate(function(){
              //     return document.getElementsByClassName('box_anchor')[0].click()
              // })
              //     .then(()=>{
              //         console.log('학사관리 페이지 접근 시작')
              //     })
            })
        }
        // if(count === 15){
        //     let resReqCount = 0;
        //     _page.on('onResourceRequested', function (requestData, networkRequest) {
        //         resReqCount++;
        //         console.log("리소스 요청: ", resReqCount);
        //         if(resReqCount === 9){
        //             _page.evaluate(function(){
        //                 return  document.getElementById('wq_uuid_413').innerText+"/"+document.getElementById('wq_uuid_444').innerText
        //             })
        //                 .then(result =>{
        //                     console.log("입학학과: ", result.split('/')[1]);
        //                     console.log("현재학년: ", result.split('/')[0]);
        //                     console.log('걸린시간: ', (new Date().getTime() - endTime)/1000 + "초")
        //                     _page.close();
        //                     _ph.exit();
        //                 })
        //                 .catch(e => {
        //                     console.log(e)
        //                     _page.close();
        //                     _ph.exit();
        //                 })
        //         }
        //     })
        //     _page.evaluate(function(){
        //         return (function(){
        //             document.getElementsByClassName('w2group w2trigger_anchor menu1 m02')[0].click();
        //             document.getElementsByClassName('w2group w2trigger_anchor menu2 m01')[0].click();
        //             document.getElementsByClassName('w2group w2trigger_anchor menu3 m01')[0].click();
        //             // document.getElementById('wq_uuid_444').innerText
        //         })();
        //     })
        // }
      })
      return _page.open('http://portal.yonsei.ac.kr/main/index.jsp');
    }).then(status => {
      console.log("포털 접속 시작: ", status
      )
      ;
    })
  })
}
