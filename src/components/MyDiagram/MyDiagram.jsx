import s from "./myDiagram.module.scss";

import { useEffect, useState } from "react";
import { Canvas, getStartPosByV } from "../Canvas/Canvas";
import { fetchBlock, fetchTransaction, txidOutputInBlock } from "../../helpers/searchBlockChain/searchBlockChain";

export function MyDiagram({ options, setSelected }) {
  const [scale, setScale] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
	function addLink(link) {
		for (let i = 0; i < links.length; i++) {
			if (links[i].startX === link.startX &&
				links[i].StartY === link.startY) {
					return;
				}
		}
		let newlinks = links;
		newlinks.push(link);
		setLinks(newlinks);
	}
  
	function addNode(node) {
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].txid === node.txid) { return; }
		}
		let newNodes = nodes;
		newNodes.push(node);
		setNodes(newNodes);
		// debugger;
	}

	function getStartPosByV(cx, starty, vin, vout) {
		let pos;
		if (vin !== null) {
			pos ={
				x: cx - 130/2 + 5,
				y: starty + 16 + 10 + 12 + 10 + 12/2,   //block + gap + txid + gap + half vin
			};
		}      
		if (vout !== null) {
			pos = {
				x: cx + 130/2 - 5,
				//block + gap + txid + gap + vin + gap + vout * (voutheight + gap) - half voutheight - gap
				y: starty + 16 + 10 + 12 + 10 + 12 + 10 + (12 + 10) * vout - 6 - 10,    
			};
		} 
		return pos;
	}

    async function _findTransactions(txid, depth, vin, startY) {
		if (depth < 0) {return;}

		let transaction = await fetchTransaction(txid);
		let block = await fetchBlock(transaction?.blockhash);
		// debugger;

		let currDepth = options.depth - depth;
		let currVout = Array.from(Array(transaction?.vout?.length).keys());

		addNode({
			cx: 100 + 200 * currDepth,
			starty: startY,
			block: block.height,
			txid: transaction.txid,
			vin: vin,
			vout: currVout,
		})

		let currentY = startY;
		let nextBlockHash = block?.nextblockhash;
		while (nextBlockHash) {
			for (let i = 0; i < transaction?.vout?.length; i++) {
				let result = await txidOutputInBlock(transaction.txid, i, nextBlockHash);
				if (result !== -1) {
					let nextTrans = await fetchTransaction(result);

					let start = getStartPosByV(100 + 200 * currDepth, startY, null, i);
					let end = getStartPosByV(100 + 200 * (currDepth + 1), currentY, i, null)
					addLink({
						startX: start.x,
						startY: start.y,
						endX: end.x,
						endY: end.y,
					});

					currentY = await _findTransactions(nextTrans.txid, depth - 1, i, currentY);
				}	
			}

			let nextBlock = await fetchBlock(nextBlockHash);
			nextBlockHash = nextBlock.nextblockhash;
		}

		return currentY;
	}

	async function findTransactions(txid, depth, vin, startY) {
		setLoading(true);
      	await _findTransactions(txid, depth, vin, startY);
		setLoading(false);
	}

    if (options.txid && options.depth) {
      	findTransactions(options.txid, options.depth, null, 20);
    }
  }, [options, nodes, setNodes, links, setLinks]);

  function downScale() {
    setScale(scale - 0.1);
  }
  function upScale() {
    setScale(scale + 0.1);
  }

  return (
    <div className={s.diagram}>
		<div className={s.buttons}>
			{/* Took scaling out because I could not get it to work like I wanted */}
			{/* <button className={s.button} onClick={downScale}>-</button>
			<button className={s.button} onClick={upScale}>+</button> */}
		</div>
		{loading &&
			<p>loading</p>
		}

		<Canvas
			nodes={nodes}
			links={links}
			scale={scale}
			setSelected={setSelected}
		/>
    </div>
  );
}
