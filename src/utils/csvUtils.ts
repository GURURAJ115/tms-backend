import {stringify} from 'csv-stringify/sync';

export const generateCSV = (data: any[]): string=>{
    return stringify(data,{
        header: true,
        columns: Object.keys(data[0]||{})
    });
};