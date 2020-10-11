if (typeof jQuery == 'undefined') {
    getScript(getGuideData);
} else {
    // Fetch data
    getGuideData();
}

function getScript(success) {
    // Load jQuery
    let script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
    script.type = 'text/javascript';

    let head = document.getElementsByTagName('head')[0];
    done = false;
    script.onload = script.onreadystatechange = function() {    
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            // Fetch data using callback
            success();
            script.onload = script.onreadystatechange = null;
        };
    
    };
    head.appendChild(script);
}

function getGuideData() {
    if (!$("link[href='https://guidedlearning.oracle.com/player/latest/static/css/stTip.css'")?.length) {
        var css_link = $("<link>", {
            rel: "stylesheet",
            type: "text/css",
            href: "https://guidedlearning.oracle.com/player/latest/static/css/stTip.css"
        });
        css_link.appendTo("head");
    }
    const guideUrl = 'https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj';
    $.ajax({
        url: guideUrl,
        dataType: 'jsonp',
        jsonpCallback: 'handleGuideData'
    });
}

function handleGuideData(response) {
    if (!!response && !!response.data && !!response.data.structure && !!response.data.structure.steps && response.data.structure.steps.length > 0) {
        const glsData = JSON.parse(JSON.stringify(response.data.structure.steps));
        for (let i = 0; i < glsData.length; i++) {
            if (glsData[i].action.type === 'tip') {
                // Nodes for showing tool-tip.
                const node = glsData[i].action;                
                $(node.selector).on('mouseover', function() {
                    const nodeEl = glsData.find(x => x.action.selector === node.selector);
                    show(nodeEl);
                });
                $(node.selector).on('mouseout', function() {
                    const nodeEl = glsData.find(x => x.action.selector === node.selector);
                    hide(nodeEl.id);
                });
                
            }
        }
    } else {
        console.log('Data for GLS unavailable.');
    }
}

function show(nodeEl) {
    const tooltipSelector = `.tip-${nodeEl.id}`;
    if ($(tooltipSelector).length === 0 || !$(tooltipSelector).length) {
        const toolTipBlock = `<div class="sttip tip-${nodeEl.id}">
            <div class="tooltip in" > 
                <div class="tooltip-arrow"></div>
                <div class="tooltip-arrow second-arrow"></div>
                <div class="popover-inner">
                    ${nodeEl.action.contents['#content']}
                </div>
            </div>
        </div>`;
        $(nodeEl.action.selector).after(toolTipBlock);
    } else {
        $(tooltipSelector).css('display', 'inline');
        $(tooltipSelector).show();
    }
}

function hide(nodeId) {
    const tooltipSelector = `.tip-${nodeId}`;
    if ($(tooltipSelector)) {
        $(tooltipSelector).hide();
    }
}