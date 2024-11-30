const deploymentId = "AKfycbweNmrgebSMBW85RxEZ92fgKnSSptJtl9CSqtWqf8bXvUAaNXMhyz_qWuxIs556zn9Cog"
const gasUrl=`https://script.google.com/macros/s/${deploymentId}/exec`
const margin=3// half the width of hte relationship clickable area
const clicks = []
const tags = []
const ids = [] 
let type="tables"      // can be overridden by url params
let schema="Northwind" // can be overridden by url params
let currentIndex=0
const relationships = []
 
async function init(){
    // example URL Parameters: ?type=tables&schema=Northwind
    console.log('initializing')
    var url = new URL(window.location);
    type = url.searchParams.get("type");
    schema = url.searchParams.get("schema");
    await getWork()
};

function imageClick(evt) {
    console.log(evt)
    console.log(evt.clientX)
    console.log( evt.clientY)
    console.log('------')
    const coords1=[]
    const coords2=[]


    if (evt.shiftKey === true){
        clicks.length = 0
    }
    
    clicks.push(evt.clientX, evt.clientY)
    
    console.log(clicks)
    if (type==="tables" && clicks.length>2) {

        tag(ids[currentIndex++]).value=clicks.join(',')
        tag(ids[currentIndex]).focus()

        clicks.length = 0
    }

    if (evt.ctrlKey === true) {
        //relatoinships
        const flip={N:"S",S:"N",E:"W",W:"E",}
        const ords=[]
        for(let x=0;x<clicks.length;x=x+2){
            ords.push({x:clicks[x],y:clicks[x+1]})
        }


        console.log("ords",ords)

        // clean up the clicking.  we only allow right angle turns
        for(let i=1;i<ords.length;i++){
            let xdif=Math.abs(ords[i].x-ords[i-1].x)
            let ydif=Math.abs(ords[i].y-ords[i-1].y)
            if (xdif>ydif){
                ords[i].y = ords[i-1].y
            }else{
                ords[i].x = ords[i-1].x
            }

            xdif=ords[i].x-ords[i-1].x
            ydif=ords[i].y-ords[i-1].y

            if(xdif===0){
                if(ydif>0){
                    ords[i].move="S"
                }else{
                    ords[i].move="N"
                }
            }else{
                if(ydif>0){
                    ords[i].move="W"
                }else{
                    ords[i].move="E"
                }
            }

        }

        console.log("ords ADJUSTED",ords)
        // handle the first coord
        clickToCoord1(ords[0].x,ords[0].y,ords[2].move)

        for(let i=1;i<ords.length-1;i++){
            clickToCoord2(ords[i].x,ords[i].y,ords[i].move,ords[i+1].move)
        }

        // handle the last coord
        clickToCoord3(ords[ords.length-1].x,ords[ords.length-1].y,ords[ords.length-1].move)
        
        console.log("coords1",coords1)
        console.log("coords2",coords2)
        

   
        tag(ids[currentIndex++]).value=coords1.join(',') + "," + coords2.join(',')

        tag(ids[currentIndex]).focus()

        clicks.length = 0
    }

    // alt key will make into look goof enough for excel

    
    // used for first ord
    function clickToCoord1(x,y,nextMove){
        let x1 = x
        let y1 = y
        let x2 = x
        let y2 = y
   

         if(nextMove==="N"){
             y1=y+margin
             y2=y-margin
         }else if(nextMove==="S"){
            y1=y-margin
            y2=y+margin
        }else if(nextMove==="E"){
            x1=x-margin
            x2=x+margin
        }else{
            x1=x+margin
            x2=x-margin
        }
        coords1.push(x1,y1)
        coords2.unshift(x2,y2)

    }  
    
    
    // used for  ords after first but not the last
    function clickToCoord3(x,y,move){


        let x1 = x
        let y1 = y
        let x2 = x
        let y2 = y
   
        if(move==="N"){
            x1=x-margin
            x2=x+margin
         }else if(move==="S"){
            x1=x+margin
            x2=x-margin
         }else if(move==="E"){
            y1=y-margin
            y2=y+margin
        }else{
            y1=y-margin
            y2=y+margin
        }

        coords1.push(x1,y1)
        coords2.unshift(x2,y2)

    }  


    // used for last ord
    function clickToCoord2(x,y,move, nextMove){

        let x1
        let y1
        let x2
        let y2
   
        if(move==="N"){
            y1=y+margin
            y2=y+margin
         }else if(move==="S"){
            y1=y-margin
            y2=y-margin
         }else if(move==="E"){
            x1=x+margin
            x2=x-margin
        }else{
            x1=x-margin
            x2=x+margin
         }

         if(nextMove==="N"){
             y1=y+margin
             y2=y-margin
         }else if(nextMove==="S"){
            y1=y-margin
            y2=y+margin
        }else if(nextMove==="E"){
            x1=x-margin
            x2=x+margin
        }else{
            x1=x+margin
            x2=x-margin
        }
        coords1.push(x1,y1)
        coords2.unshift(x2,y2)

    }  
}



async function submit(){
  console.log("Submitting")
  const coords={}
  for(const id of ids){
    if(tag(id).value.length>0){
      coords[id]=tag(id).value
    }  
  }
  console.log("coords", coords)

  const jsonPayload={mode:"record-coords",data:coords,type,schema, debug:true}

    // mode must be specified in the jsonPayload
    console.log("jsonPayload",jsonPayload)
    jsonPayload.debug="true"
    
    const settings = {
       method: 'POST',
       headers: {
         Accept: 'application/json',
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: JSON.stringify(jsonPayload).split().join("")
    }
    
    console.log("settings",settings)
    
    try {
      const fetchResponse = await fetch(gasUrl, settings);
      const data = await fetchResponse.text();
      console.log(data);
    } catch (e) {
       console.error(e);
    }    




}





    
  
  






async function getWork(){
    //schemamaker google sheet ownned by gove.allen
    
    const fullUrl=`${gasUrl}?mode=${type}&schema=${schema}&debug=true`
    console.log("fullUrl",fullUrl)
    const reply = await fetch(fullUrl);
    const replyText = await reply.text();
    console.log("replyTExt", replyText)
    const response = JSON.parse(replyText)
    console.log("response", response);
    const html=["<table>"]

    if(type==="tables"){ 
        for(const [table,coords] of Object.entries(response)){
            ids.push(table)
            html.push(`<tr><td>${table}</td><td><input id="${table}"></td></tr>`)
        }
        html.push(`<tr><td colspan="2" align="right"><button onclick="submit()">Submit</button></td></tr>`)
    }else{
        for(const rel of response){
            ids.push(rel)
            const rels=rel.split("-")
            html.push(`<tr><td align="right">${rels[0]}</td><td><input id="${rel}"></td><td>${rels[1]}</td></tr>`)
        }
        html.push(`<tr><td colspan="3" align="right"><button onclick="submit()">Submit</button></td></tr>`)
    }


    html.push("</table>")
    tag("work").innerHTML=html.join("")
    console.log(html.join("\n"))
    tag(ids[0]).focus()

}

function tag(id){
return document.getElementById(id)
}

