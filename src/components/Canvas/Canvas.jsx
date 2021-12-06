import s from './canvas.module.scss';

import { useEffect, useRef, useState } from "react"

// export function getStartPosByV(cx, starty, vin, vout) {
//     if (vin) {
//         return ({
//             x: cx - 130/2 + 5,
//             y: starty + 16 + 10 + 12 + 10 + 12/2,   //block + gap + txid + gap + half vin
//         })
//     }      
//     if (vout) {
//         return ({
//             x: cx + 130/2 - 5,
//             //block + gap + txid + gap + vin + gap + vout * (voutheight + gap) - half voutheight - gap
//             y: starty + 16 + 10 + 12 + 10 + 12 + 10 + (12 + 10) * vout - 6 - 10,    
//         })
//     }  
// }

export function Canvas({ nodes, links, scale, setSelected }) {
    const [objects, setObjects] = useState([]);

    const canvasRef = useRef(null);

    function addObject(obj) {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].txid === obj.txid) {return;}
        }
        let newObj = objects;
        newObj.push(obj);
        setObjects(newObj);
    }

    function reset(ctx) {
        ctx.save();

        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.restore();
    }

    function node(ctx, scale, cx, starty, block, txid, vin, vout) {
        ctx.save();

        ctx.translate(-cx, -starty);
        ctx.scale(scale, scale);
        ctx.translate(cx, starty);

        const nodeWidth = 130;
        let currY = starty;

        let nodeHeight = 16 + 12 + 10 + 10;                                 // block + txid + gap + gap
        if (vin !== null) {nodeHeight = nodeHeight + 10 + 12}                        // + gap + vin
        if (vout !== null) {nodeHeight = nodeHeight + vout.length * (12 + 10);}      // + vout + gap

        addObject({
            txid: txid,
            top: starty,
            bot: starty + nodeHeight,
            left: cx - nodeWidth/2,
            right: cx + nodeWidth/2,
        })

        // make background
        ctx.fillRect(cx - nodeWidth/2 - 5, starty - 5, nodeWidth + 10, nodeHeight + 10);
        ctx.fillStyle = 'white';
        ctx.fillRect(cx - nodeWidth/2, starty, nodeWidth, nodeHeight);
        ctx.fillStyle = 'black';

        // write what block this node is a part of
        ctx.font = "16px Arial";
        ctx.fillText("Block "+block, cx - nodeWidth/2 + 10, currY + 16);
        currY = currY + 16 + 5;    // update the y cordinates

        //make seperation line
        ctx.beginPath();
        ctx.moveTo(cx - nodeWidth/2 + 10, currY);
        ctx.lineTo(cx + nodeWidth/2 - 10, currY);
        ctx.stroke();
        ctx.closePath();
        currY = currY + 5;    // update the y cordinates

        // write what transaction this is
        ctx.font = "12px Arial";
        ctx.fillText("txid " + txid.slice(0, 10) + "...", cx - nodeWidth/2 + 10, currY + 12);
        currY = currY + 12 + 5;    // update the y cordinates

        //make seperation line
        ctx.beginPath();
        ctx.moveTo(cx - nodeWidth/2 + 10, currY);
        ctx.lineTo(cx + nodeWidth/2 - 10, currY);
        ctx.stroke();
        ctx.closePath();
        currY = currY + 5;    // update the y cordinates

        if (vin !== null) {
            // write vin number
            ctx.font = "12px Arial";
            ctx.fillText("vin: ", cx - nodeWidth/2 + 10, currY + 12);
            currY = currY + 12 + 5;    // update the y cordinates
            
            //make seperation line
            ctx.beginPath();
            ctx.moveTo(cx - nodeWidth/2 + 10, currY);
            ctx.lineTo(cx + nodeWidth/2 - 10, currY);
            ctx.stroke();
            ctx.closePath();
            currY = currY + 5;    // update the y cordinates
        }

        if (vout !== null) {
            // write vout numbers
            ctx.font = "12px Arial";

            for (let i = 0; i < vout.length; i++) {
                ctx.fillText("vout: " + vout[i], cx - nodeWidth/2 + 10, currY + 12);
                currY = currY + 12 + 5;    // update the y cordinates

                //make seperation line
                ctx.beginPath();
                ctx.moveTo(cx - nodeWidth/2 + 10, currY);
                ctx.lineTo(cx + nodeWidth/2 - 10, currY);
                ctx.stroke();
                ctx.closePath();
                currY = currY + 5;    // update the y cordinates
            }
        }



        ctx.restore();
    }

    function link(ctx, scale, startX, startY, endX, endY) {
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(startX * scale, startY * scale);
        ctx.lineTo(endX * scale, endY * scale);
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }

    function scaleCanvas(canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    function click(event) {
        const posX = event.layerX,
            posY = event.layerY;

        for (let i = 0; i < objects.length; i++) {
            let o = objects[i];
            if (o.left < posX && posX < o.right &&
                o.top  < posY && posY < o.bot) {
                setSelected(o.txid);
                console.log(o.txid);
                return;
            }
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        scaleCanvas(canvas);
        const context = canvas.getContext('2d')
        
        reset(context);

        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                let n = nodes[i];
                node(context, scale, n.cx, n.starty, n.block, n.txid, n.vin, n.vout)
            }
        }

        if (links) {
            for (let j = 0; j < links.length; j++) {
                let l = links[j];
                link(context, scale, l.startX, l.startY, l.endX, l.endY);
            }
        }

        canvas.addEventListener('click', click);

      }, [nodes, links, scale, 'click', node, link])

    return(
        <canvas ref={canvasRef} className={s.canvas} >
            Sorry, but your browser does not support the HTML5 canvas tag.
        </canvas>
    )
}