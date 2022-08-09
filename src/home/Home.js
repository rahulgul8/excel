import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import util from './Exception'
import present from './Presentation'
import styles from './home.module.css';
import { JsonToTable } from "react-json-to-table";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class Home extends Component {

    constructor() {
        super();
        this.state = {
            results: null,
        }
    }

    showFile = async (e) => {
        e.preventDefault()
        const f = e.target.files[0];
        const data = await f.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const thresSheet = workbook.Sheets[workbook.SheetNames[1]];
        let thresholds = XLSX.utils.sheet_to_json(thresSheet);

        let table = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        let titles = Object.keys(table[0]);
        table = table.map((obj) => Object.values(obj));
        //interpolating the table
        table = table[0].map((_, colIndex) => table.map(row => row[colIndex]))
        let dates = table[0];
        let results = [];
        let statics = [];
        let empties = [];
        let limit = 17;
        for (let i = 1; i < table.length; i++) {
            let title = titles[i];
            let threshold = thresholds[0][title];
            let json = this.getSheetData(table[i], dates, threshold)
            let stat = this.getStaticData(table[i], dates, limit)
            let empty = this.getEmptyData(table[i], dates, limit)
            statics.push({ title, json: stat, limit });
            results.push({ title, json, threshold })
            empties.push({ title, json: empty, limit })
        }
        this.setState({ results, statics, empties })
    }

    getSheetData(column, dates, threshold) {
        let exceed = util.findExceedence(column, dates, threshold);
        return present.formatExceedance(exceed).map((d, i) => ({
            "SL. No.": i + 1,
            "Date": d.dateRange,
            "Exceedance Observed (hrs)": d.timeRange,
            "Total Exceedance in Hours": d.hours,
            "Range in ppm": d.valueRange,
            "No.of Occurance of Exceedance in 15mins average data": d.count
        }));
    }

    getStaticData(column, dates, threshold) {
        let exceed = util.findStatic(column, dates, threshold);
        return present.formatExceedance(exceed).filter(d => !isNaN(d.valueRange) || d.valueRange < 0).filter(d => d.valueRange.toString().trim().length != 0).map((d, i) => ({
            "SL. No.": i + 1,
            "Date": d.dateRange,
            "Static Data": d.valueRange,
            "Static Data Observed (hrs)": d.timeRange,
            "Total Static data in Hours": d.hours,
            "No.of Occurance of Static Data in 15mins average data": d.count
        }));
    }

    getEmptyData(column, dates, threshold) {
        let exceed = util.findStatic(column, dates, threshold);
        return present.formatExceedance(exceed).filter(d => isNaN(d.valueRange) || d.valueRange < 0 || d.valueRange.toString().trim().length == 0).map((d, i) => ({
            "SL. No.": i + 1,
            "Date": d.dateRange,
            "No data Observed (hrs)": d.timeRange,
            "Observed value": d.valueRange,
            "No.of Occurance of Exceedance in 15mins average data": d.count
        }));
    }


    getScreen(results) {
        return results ? results.map(d => <div>
            <h1 className={styles.title}>{d.title}</h1>
            <h6>{d.threshold && `Threshold value: ${d.threshold}`}</h6>
            <JsonToTable json={d.json} /></div>) : null;
    }

    render() {
        return (<div className={styles.content}>
            <div className="mb-3">
                <label for="formFile" className="form-label">Select your Data file</label>
                <input className="form-control" type="file" onChange={(e) => this.showFile(e)} />
            </div>

            <br />
            <Tabs>
                <TabList>
                    <Tab>Exceedance Data</Tab>
                    <Tab>Static Data</Tab>
                    <Tab>Empty Data</Tab>
                </TabList>

                <TabPanel>
                    {this.getScreen(this.state.results)}
                </TabPanel>
                <TabPanel>
                    {this.getScreen(this.state.statics)}
                </TabPanel>
                <TabPanel>
                    {this.getScreen(this.state.empties)}
                </TabPanel>
            </Tabs>

        </div>
        );
    }
}

export default Home;