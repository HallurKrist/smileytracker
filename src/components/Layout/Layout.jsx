import { useState } from 'react';
import { MyDiagram } from '../MyDiagram/MyDiagram';
import { Info } from '../Info/Info';
import { Options } from '../Options/Options';
import s from './layout.module.scss';



export function Layout() {
    const [options, setOptions] = useState({});
    const [selected, setSelected] = useState(null);

    

    return (
        <div className={s.container}>
            <div className={s.diagram}>
                <MyDiagram options={options} setSelected={setSelected}/>
            </div>
            <div className={s.sidebar}>
                <div className={s.options}>
                    <Options setOptions={setOptions}/>
                </div>
                <div className={s.info}>
                    <Info selected={selected}/>
                </div>
            </div>
        </div>
    );
}