(function() {
    var log2 = Math.log(2);
    var timeHist = [];

    var histNode;
    injectHistogram = function() {
        if (typeof(histNode) !== 'undefined') {
            return;
        }

        histNode = document.createElement("div");
        histNode.className = "0x2c-timeout-histogram";
        histNode.innerHTML = "foo";
        document.body.appendChild(histNode);
    };

    var old_setInterval = window.setInterval;
    window.setInterval = function(callback, timeout)
    {
        var caller = arguments.callee.caller;

        console.log("setInterval:" +
                    " caller: " + caller.name +
                    " callback: " + callback.name +
                    " timeout: " + timeout);
        return (old_setInterval(callback, timeout));
    };

    var old_setTimeout = window.setTimeout;
    window.setTimeout = function(callback, timeout)
    {
        var caller = arguments.callee.caller;

        console.log("setTimeout:" +
                    " caller: " + caller.name +
                    " callback: " + callback.name +
                    " timeout: " + timeout);

        var wrappedCallback = function() {
            var startTime = performance.now();
            callback();
            var endTime = performance.now();
            var runtime = (endTime - startTime) * 1000;
            var timebucket = Math.log(runtime) / log2;

            if (timebucket < 0) {
                timebucket = 0;
            }

            timeHist[timebucket] = (timeHist[timebucket] || 0) + 1;
            injectHistogram();
            console.log("timeout callback " +
                        " from " + caller.name +
                        " to " + callback.name +
                        " duration " + (endTime - startTime));
        };
        return (old_setTimeout(wrappedCallback, timeout));
    };

    console.log("loaded!");
})();
