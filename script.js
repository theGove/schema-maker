const clicks = []
const tags = []
const tables = [] 
const relationships = []
 
function init(){
    console.log('initializing')
};

function imageClick(evt) {
    console.log(evt)
    console.log(evt.clientX)
    console.log( evt.clientY)
    console.log('------')


    if (evt.shiftKey === true){
        clicks.length = 0
    }
    
    clicks.push(evt.clientX, evt.clientY)
    
    if (evt.ctrlKey === true) {
        console.log(clicks)
        
        
        const output = `coords = "${clicks.join(',')}" shape = "${clicks.length > 4 ? "poly": "rect"}"`
        tags.push(output.join(','))

        tables.push(clicks.join(','))

        clicks.length = 0
    }


    // alt key will make into look goof enough for excel

    


};

