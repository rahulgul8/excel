import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import util from './Exception'
import present from './Presentation'
import styles from './home.module.css';
import { JsonToTable } from "react-json-to-table";


const html = `<table className="table">
    <thead>
        <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
        </tr>
        <tr>
            <td>Mary</td>
            <td>Moe</td>
            <td>mary@example.com</td>
        </tr>
        <tr>
            <td>July</td>
            <td>Dooley</td>
            <td>july@example.com</td>
        </tr>
    </tbody>
</table>`;
class Home extends Component {

    constructor() {
        super();
        this.state = {
            result: null,
        }
    }

    showFile = async (e) => {
        e.preventDefault()
        const f = e.target.files[0];
        const data = await f.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let table = XLSX.utils.sheet_to_json(worksheet);
        table = table.map((obj) => Object.values(obj));
        table = table[0].map((_, colIndex) => table.map(row => row[colIndex]))
        let exceed = util.findExceedence(table[1], table[0], 0);
        let presentableJson = present.formatExceedance(exceed);
        this.setState({ result: presentableJson })
    }


    render() {
        return (<div className={styles.content}>
            <input type="file" onChange={(e) => this.showFile(e)} />
            <br />
            {this.state.result ? <JsonToTable json={this.state.result} /> : null}
        </div>
        );
    }
}

export default Home;