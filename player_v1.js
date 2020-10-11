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

    let jqueryUi = document.createElement('script');
    jqueryUi.src = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js';
    jqueryUi.type = 'text/javascript';

    let head = document.getElementsByTagName('head')[0];
    done = false;
    script.onload = script.onreadystatechange = jqueryUi.onload = jqueryUi.onreadystatechange = function() {    
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            // Fetch data using callback
            success();
            script.onload = script.onreadystatechange = null;
        };
    
    };
    head.appendChild(script);
    head.appendChild(jqueryUi);
}

function getGuideData() {
    if (!$("link[href='https://guidedlearning.oracle.com/player/latest/static/css/stTip.css'")?.length) {
        $('head').append('<link rel=stylesheet" href="https://guidedlearning.oracle.com/player/latest/static/css/stTip.css" type="text/css" />');
        $('head').append('<link rel=stylesheet" href="https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" type="text/css" />');
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
                $(node.selector).prop('title', node.contents['#content']);
                $(node.selector).tooltip({
                    content: $(node.selector).prop('title')
                });
                $(node.selector).mouseover(function() {
                    $(node.selector).tooltip('close');
                    $(node.selector).tooltip('open');
                });
                $(node.selector).mouseout(function() {
                    $(node.selector).tooltip('close');
                });
            }
        }
    } else {
        console.log('Data for GLS unavailable.');
    }
}