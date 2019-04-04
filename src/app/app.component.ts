import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js'
import * as XLSX from 'xlsx'
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chart project';
  results: any[] = [
    {
      "month": "Jan",
      "price": "180"
    },
    {
      "month": "Feb",
      "price": "200"
    },
    {
      "month": "March",
      "price": "210"
    },
    {
      "month": "April",
      "price": "190"
    },
    {
      "month": "May",
      "price": "240"
    },
    {
      "month": "June",
      "price": "230"
    },
    {
      "month": "July",
      "price": "260"
    },
    {
      "month": "Aug",
      "price": "210"
    },
    {
      "month": "Sept",
      "price": "300"
    }];
  month = [];
  price = [];
  pdfData: any[] = [];
  doc = new jsPDF()
  imagesArray: any[]=[];
  @ViewChild('lineChart') private chartRef;
  chart: any;
  csvArray: any[]=[]
  constructor() {
    this.doc.text(10, 10, "Report builder Demo")
    for (let i = 0; i < this.results.length; i++) {
      this.pdfData.push([
        this.results[i].month,
        this.results[i].price
      ])
      this.csvArray.push({
        month: this.results[i].month,
        price: this.results[i].price
      })
    }
    console.log(this.pdfData)
    console.log(this.csvArray, "csv array")
    this.doc.autoTable({
      head: [['month', 'Price']],
      body: this.pdfData
    })

  }

  ngOnInit() {
    this.results.forEach(y => {
      this.month.push(y.month)
      this.price.push(y.price)
    })
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.month,
        datasets: [
          {
            label: "Price in Dollars",
            data: this.price,
            backgroundColor: [
              'rgba(0, 99, 132, 0.6)',
              'rgba(30, 99, 132, 0.6)',
              'rgba(60, 99, 132, 0.6)',
              'rgba(90, 99, 132, 0.6)',
              'rgba(120, 99, 132, 0.6)',
              'rgba(150, 99, 132, 0.6)',
              'rgba(180, 99, 132, 0.6)',
              'rgba(210, 99, 132, 0.6)',
              'rgba(240, 99, 132, 0.6)'
            ],
            borderColor: [
              'rgba(0, 99, 132, 1)',
              'rgba(30, 99, 132, 1)',
              'rgba(60, 99, 132, 1)',
              'rgba(90, 99, 132, 1)',
              'rgba(120, 99, 132, 1)',
              'rgba(150, 99, 132, 1)',
              'rgba(180, 99, 132, 1)',
              'rgba(210, 99, 132, 1)',
              'rgba(240, 99, 132, 1)'
            ],
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true,
            barPercentage: 0.5,
            barThickness: 50,
            maxBarThickness: 70,
            gridLines: {
              offsetGridLines: false
            }
          }],
          yAxes: [{
            display: true
          }]
        },
        elements: {
          rectangle: {
            borderSkipped: 'left'
          }
        }
      }
    })
  }
download_excel() {
  var imagesArray = [{image: 'http://159.65.149.6:8090/Sangath/forms/files/downloadFile/1552040551174.jpeg'}]
  const workBook = XLSX.utils.book_new(); // create a new blank book
  const workSheet = XLSX.utils.json_to_sheet(this.csvArray);
  //const worksheet1 = XLSX.utils.json_to_sheet(this.imagesArray)
  XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
  const worksheet1 = XLSX.utils.json_to_sheet(imagesArray);
  XLSX.utils.book_append_sheet(workBook, worksheet1, 'data1')
 // XLSX.utils.book_append_sheet(workBook, worksheet1, 'data')
  XLSX.writeFile(workBook, 'report.xlsx'); // initiate a file download in browser   
} 

  imageData() {
    var canvasImage = this.chart.toBase64Image();
    this.doc.addPage()
    this.doc.setFontSize(15)
    this.doc.addImage(canvasImage, 'JPEG', 10, 10, 180, 100)
    this.doc.save('report demo' + new Date() + '.pdf')
  }

  downLoadFile() {

    this.JSONToCSVConvertor(this.csvArray, "reportBuilder", "Report Builder")
  }

  JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData
    var CSV = '';

    CSV += ReportTitle + '\r\n\n';

    if (ShowLabel) {
      var row = "";

      for (var i = 0; i < arrData.length; i++) {
        var row = "";
  
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }
  
        row.slice(0, row.length - 1);
  
        //add a line break after each row
        CSV += row + '\r\n';
  }
      row = row.slice(0, -1);
      //append Label row with line break


      //add a line break after each row
      CSV += row + '\r\n';
    }

    if (CSV == '') {
      alert("Invalid data");
      return;
    }

    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    // link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }

}
