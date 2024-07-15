import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {

  chartDonut!: am5.Root;
  chartBar!: am5.Root;
  chartDonutData: any[] = [];
  chartBarData: any[] = [];
  tableUsersData: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  ngOnDestroy(): void {
    if (this.chartDonut) {
      this.chartDonut.dispose();
    }
    if (this.chartBar) {
      this.chartBar.dispose();
    }
  }

  fetchDashboardData() {
    this.authService.getDashboardData().subscribe(
      data => {
        this.chartDonutData = data.chartDonut;
        this.chartBarData = data.chartBar;
        this.tableUsersData = data.tableUsers;
        console.log(data);

        // Render charts after data is fetched
        this.renderDonutChart();
        this.renderBarChart();
      },
      error => {
        console.error('Error fetching dashboard data', error);
      }
    );
  }


  renderDonutChart(): void {
    // Create root element
    let root = am5.Root.new("donutChart");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    let chart = root.container.children.push(am5percent.PieChart.new(root, {
      endAngle: 270
    }));

    // Create series
    let series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "name",
      endAngle: 270,
      radius: am5.percent(70),
      innerRadius: am5.percent(40)
    }));

    series.data.setAll(this.chartDonutData);

    series.appear(1000, 100);

    this.chartDonut = root;
  }

  renderBarChart(): void {
    let root = am5.Root.new("barChart");
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        // some features to zoom in zoom out
        panX: true, 
        panY: true, 
        wheelX: "panX", 
        wheelY: "zoomX", 
        pinchZoomX: true, 
        pinchZoomY: true, 
        layout: root.verticalLayout
      })
    );

    // to create y axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    // to create x axis
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "name"
      })
    );
    xAxis.data.setAll(this.chartBarData);

    let series1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "name"
      })
    );
    series1.data.setAll(this.chartBarData);
    chart.set("cursor", am5xy.XYCursor.new(root, {}));
  }


  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }
}
