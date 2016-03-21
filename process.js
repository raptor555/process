
var Run = (function () {
    var instance;
    var processArr = [];
    function createInstance() {
        var object = new RunLoop("I am the instance");
        return object;
    }
    function RunLoop(param) {
        var looptime = 100;
        setInterval(function () {
            for(var i=0;i<processArr.length;i++){
                var p = processArr[i];
                var runthis = true;
                if(p.work.worker>=p.param.worker){
                    //console.log('worker');
                    runthis = false;
                }
                if(p.param.loop>0){
                    if(p.work.loop>=p.param.loop){
                        //console.log('loop');
                        runthis = false;
                        Run.del(p.process)
                    }
                }
                if(p.param.every>0){
                    p.work.every += looptime;
                    if(p.work.every<(p.param.every*1000)){
                        //console.log('every');
                        runthis = false;
                    }else{
                        p.work.every = 0;
                    }
                }
                if(p.param.delay>0){
                    p.work.delay += looptime;
                    if(p.work.delay<(p.param.delay*1000)){
                        //console.log('delay');
                        runthis = false;
                    }
                }
                if(runthis){
                    p.work.loop++;
                    p.work.worker++;
                    //p.work.every = 0;
                    p.work.delay = 0;
                    p.work.working = true;
                    console.log('run ' + p.name + ' : ' + p.work.loop);
                    p.process(p.work);
                }
            }
        }, looptime);
    }
    function getInstance() {
        if (!instance) {
            instance = createInstance();
        }
        return instance;
    }
    getInstance();
    return {
        add: function(process, param) {
            var p = {};
            p.name = process.name;
            p.process = process;
            p.param = {};
            p.param.worker = param.worker || 1;
            p.param.loop = param.loop || 0;
            p.param.delay = param.delay || 0.0;
            p.param.every = param.every || 0.0;
            p.work = {};
            p.work.loop = 0;
            p.work.worker = 0;
            p.work.working = false;
            p.work.delay = p.param.delay*1000;
            p.work.every = p.param.every*1000;
            p.work.end = function(){
              this.working = false;
              this.delay = 0;
              this.worker--;
            }
            processArr.push(p);
        },
        del: function(process){
            var name = process.name;
            for(var i=0;i<processArr.length;i++){
                var p = processArr[i];
                if(p.name == name) break;
            }
            processArr.splice(i, 1);
        }
    };
})();

/* test
function main() {
  function p1(work){
    setTimeout(function(){
      //console.log(work);
      work.end();
    }, 1000);
  }
  
  function p2(work){
    //console.log('p 2');
    work.end();
  }
  
  Run.add(p1, {every: 2, worker: 2, loop: 5});
  Run.add(p2, {delay: 0.3, worker: 3, loop: 5});
}
main();
*/
