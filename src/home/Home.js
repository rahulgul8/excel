import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import util from './Exception'
import present from './Presentation'
import styles from './home.module.css';
import { JsonToTable } from "react-json-to-table";


class Home extends Component {

    constructor() {
        super();
        this.state = {
            results: null,
        }
    }

    showFile = async (e) => {
        debugger
        e.preventDefault()
        const f = e.target.files[0];
        const data = await f.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const thresSheet = workbook.Sheets[workbook.SheetNames[1]];
        let thresholds = XLSX.utils.sheet_to_json(thresSheet);

        let table = XLSX.utils.sheet_to_json(worksheet);
        let titles = Object.keys(table[0]);
        table = table.map((obj) => Object.values(obj));
        //interpolating the table
        table = table[0].map((_, colIndex) => table.map(row => row[colIndex]))
        let dates = table[0];
        let results = [];
        for (let i = 1; i < table.length; i++) {
            let title = titles[i];
            let threshold = thresholds[0][title];
            let json = this.getSheetData(table[i], dates, threshold)
            results.push({ title, json, threshold })
        }
        this.setState({ results })
    }

    getSheetData(column, dates, threshold) {
        let exceed = util.findExceedence(column, dates, threshold);
        return present.formatExceedance(exceed);
    }


    render() {
        return (<div className={styles.content}>
            <input type="file" onChange={(e) => this.showFile(e)} />
            <br />
            {this.state.results ? this.state.results.map(d => <div><h1 className={styles.title}>{d.title}</h1><h6>{`Threshold value: ${d.threshold}`}</h6><JsonToTable json={d.json} /></div>) : null}
        </div>
        );
    }
}

export default Home;