(function() {
    var log2 = Math.log(2);
    var histNode;
    var timeHist = [];

    var TimeBucket = function(bucket_) {
        this.bucket = bucket_;
        this.count = 0;

        if (typeof(histNode) === 'undefined') {
            injectHistogram();
        }

        var node = document.createElement("div");
        var label = document.createElement("span");
        label.innerHTML = this.bucket + ": ";
        node.appendChild(label);
        this.content = document.createElement("span");
        node.appendChild(this.content);
        histNode.appendChild(node);
        this.updateDisplay();
    };
    TimeBucket.prototype = {
        register: function() {
            this.count += 1;
            this.updateDisplay();
        },
        updateDisplay: function() {
            this.content.innerHTML = this.count;
        }
    };

    var injectHistogram = function() {
        if (typeof(histNode) !== 'undefined') {
            return;
        }

        histNode = document.createElement("div");
        histNode.id = "js-event-stats-0x2c";
        histNode.innerHTML = "foo";
        document.body.appendChild(histNode);
    };

    var old_setInterval = window.setInterval;
    window.setInterval = function(callback, timeout)
    {
        return (old_setInterval(callback, timeout));
    };

    var old_setTimeout = window.setTimeout;
    window.setTimeout = function(callback, timeout)
    {
        var wrappedCallback = function() {
            var startTime = performance.now();
            callback();
            var endTime = performance.now();
            var runtime = (endTime - startTime) * 1000;
            var timebucket = Math.round(Math.log(runtime) / log2);

            if (timebucket < 0) {
                timebucket = 0;
            }

            if (typeof(timeHist[timebucket]) === 'undefined') {
                timeHist[timebucket] = new TimeBucket(timebucket);
            }

            timeHist[timebucket].register();
        };
        return (old_setTimeout(wrappedCallback, timeout));
    };

    console.log("loaded!");
})();
