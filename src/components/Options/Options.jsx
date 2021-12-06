import { useState } from 'react';
import s from './options.module.scss';





export function Options({ setOptions }) {
    const [txId, setTxId] = useState('');
    const [depth, setDepth] = useState(0);
    const [invalidInput, setInvalidInput] = useState(true);


    function updateTXID(event) {
        const txid = event?.target?.value;
        if (Object.prototype.toString.call(txid) === '[object String]' && txid.length === 64) {
            setTxId(txid);
            setInvalidInput(false);
            return;
        }
        setInvalidInput(true);
    }

    function updateDepth(event) {
        const depth = event?.target?.value;
        if (0 <= depth && depth <= 5) {
            setDepth(depth);
        }
    }

    function confirmOptions() {
        setOptions({
            txid:  txId,
            depth: depth
        });
    }

    return (
        <div>
            <div>
                <label for="txid">TxId:</label>
                <input type="text" id="txid" name="txid" onChange={updateTXID}/>
            </div>
            <div>
                <label for="depth">Depth:</label>
                <input type="number" id="depth" name="depth" placeholder="Max 5" onChange={updateDepth} value={depth}/>
            </div>
            <p>
                Rendering time can be very long if the transaction that is being traces is from a old block. 
                That is because this site goes through all blocks that are newer than the one the 
                transaction is a part of and checks if it finds connected transactions.
            </p>
            {invalidInput && <p>Invalid input</p>}
            <button onClick={confirmOptions} disabled={invalidInput}>Render diagram</button>
        </div>
    );
}