import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CutomDropdownComponent } from '../../../../../shared/components/customdropdown';
import { NavModule } from '../../../../../shared/components/tab/tab.module';
import { DocumentsData, FollowersData, ProjectsData } from '../../../../../shared/data/account';

@Component({
  selector: 'app-customer-show',
  standalone: true,
  imports: [CommonModule, NavModule, LucideAngularModule, NgApexchartsModule, CutomDropdownComponent],
  templateUrl: './customer-show.component.html',
  styleUrl: './customer-show.component.scss',
})
export class CustomerShowComponent {
  documentdata: any;
  projectsdata: any;
  followersData: any;

  recentStatisticsChart: any;

  ngOnInit(): void {
    // Chart Color Data Get Function
    this._recentStatisticsChart('["bg-custom-500", "bg-purple-500"]');

    (this.documentdata = DocumentsData), (this.projectsdata = ProjectsData), (this.followersData = FollowersData);
  }

  rgbToHex(rgb: any) {
    // Extract RGB values using regular expressions
    const rgbValues = rgb.match(/\d+/g);

    if (rgbValues.length === 3) {
      var [r, g, b] = rgbValues.map(Number);
    }
    // Ensure the values are within the valid range (0-255)
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Convert each component to its hexadecimal representation
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    // Combine the hexadecimal values with the "#" prefix
    const hexColor = `#${rHex}${gHex}${bHex}`;

    return hexColor.toUpperCase(); // Convert to uppercase for consistency
  }

  getChartColorsArray(colors: any) {
    const parsedColors = JSON.parse(colors);
    const mappedColors = parsedColors.map((value: any) => {
      const newValue = value.replace(/\s/g, '');
      if (!newValue.includes('#')) {
        const element = document.querySelector(newValue);
        if (element) {
          const styles = window.getComputedStyle(element);
          const backgroundColor = styles.backgroundColor;
          return backgroundColor || newValue;
        } else {
          const divElement = document.createElement('div');
          divElement.className = newValue;
          document.body.appendChild(divElement);

          const styles = window.getComputedStyle(divElement);
          const backgroundColor = styles.backgroundColor.includes('#') ? styles.backgroundColor : this.rgbToHex(styles.backgroundColor);
          return backgroundColor || newValue;
        }
      } else {
        return newValue;
      }
    });
    return mappedColors;
  }

  /**
   * Recent Statistics Chart
   */
  private _recentStatisticsChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.recentStatisticsChart = {
      series: [
        {
          name: 'Following',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 87, 72],
        },
        {
          name: 'Followers',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 105, 91],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: colors,
      stroke: {
        show: true,
        width: 1,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      fill: {
        opacity: 1,
      },
    };
  }
}
