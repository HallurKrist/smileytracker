import s from './info.module.scss';

import { useEffect, useState } from 'react';
import { fetchTransaction } from '../../helpers/searchBlockChain/searchBlockChain';



export function Info({ selected }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        if (selected) {
            const result = fetchTransaction(selected);

            if (result === -1) setError(true);
            setTransaction(result);
            setLoading(false);
        }
    }, [selected])


    if (!transaction) {
        return <p>No transaction selected</p>;
    }

    if (error) {
        return <p>Could not get transaction information</p>;
    }

    if (loading) {
        return <p>Getting transaction information</p>;
    }

    return (
        <div className={s.info}>
            <p className={s.txid}>{selected}</p>
            <a className={s.link} href={"https://blocks.smileyco.in/tx/"+selected}>Inspect</a>
        </div>    
    );
}