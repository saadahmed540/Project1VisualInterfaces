# Project1VisualInterfaces

Motivation:
The County Health Data Visualization project was developed to help users explore and understand key public health metrics across different counties in the U.S. This interactive tool allows users to analyse various attributes such as elderly population percentages, access to healthcare, education levels, and median household income.
The goal of this application is to make complex health data accessible and intuitive for researchers, policymakers, and the general public. Users can interact with multiple visualization components to discover trends, patterns, and relationships within the data.
Dataset Used:
The data used in this project comes from the National Health Data 2024 dataset, which includes county level statistics on various health-related factors such as:
•	Elderly Population (%)
•	Percentage Without Health Insurance (%)
•	Median Household Income
•	Education Less than High School (%)
This dataset was processed and visualized using d3.v6.min.js and topojson.v3.js to generate interactive charts and maps. You can access the dataset here. 
Visualization Design 
Before implementation, I considered various design layouts for the interface, ensuring that each visualization complements the others. Some sketches were made to decide the placement of the histogram, scatter plot, and choropleth map, optimizing for clarity and ease of use. But later on after hearing my friends feedback on my first layout, I decided to change the layout of my page, so I kept a side bar and where I can select the attribute and display page details and on the right I can display histogram, scatter plot and choropleth maps and this visualization satisfies the less scrolling condition.
Visualization Components & Interactivity
The application consists of three main visualization components:
1. Histogram
•	Displays the data in the bar graphs of the selected attribute.
•	Hovering over the bars shows tooltips with detailed information. The histogram updates dynamically when a new attribute is selected.

2. Scatter Plot 
•	It compares two selected attributes to show correlations. The X- axis is selected at the top of the scatter plot.
•	Users can brush over a section of the scatter plot to highlight a subset of the data.
•	The corresponding histogram and choropleth map update dynamically to reflect the selection.

3. Choropleth Map 
•	It is a geographic visualization displaying the selected health attribute across counties in the U.S.
•	Hovering over a county displays a tooltip with detailed information of the selected attribute.
•	The Choropleth map updates when user brush over a region on the scatter plot.

User Interface:
•	A dropdown menu allows users to select different attributes for visualization. By default, the Elderly population option will be selected for both X and Y attributes.
•	I used the color #addd8e because it is a soft pastel green color it provides calm and non-intrusive appearance and it is often associated with growth and wellbeing.
•	I used the color d3.interpolateOranges for Elderly population because it is a sequential color ranges from light yellow-orange to deep orange and it intuitively represent higher density.
•	I used the color d3.interpolateWarm for Percent without health insurance. It ranges from pink to deep purple and it emphasizes regions with higher uninsured rate.
•	I used the color d3.interpolateBrBG for Median Household Income. Its ranges are Brown-Blue-Green. It is great for datasets where you want to contrast low-income and high-income regions.
•	I used the color d3.interpolateMagma for Education less than High school. It ranges from dark purple to deep yellow. It is color blind friendly and highly readable.
•	I used the color black to reflect the data on the choropleth map when the area is selected in scatter plot because I wanted to highlight the data with this color on the map.
•	I also added the Tool tips for the histogram and choropleth maps.
•	I also added the Brushing functionality to the scatter plot, where the selected area on the plot will update the histogram and choropleth map.

Findings & Insights
Using this application, we can observe:
•	Elderly Population & Insurance: This is my primary theme, a high percentage of elderly residents often correlates with better insurance coverage, likely due to Medicare availability.
•	Income Disparities & Health Outcomes: Counties with higher median household income tend to have lower uninsured rates and better health indicators.
•	Education & Health Correlation: Areas with low education levels often show higher uninsured rates and lower overall health outcomes.
These insights help policymakers and researchers identify high-risk areas that may require targeted health interventions.

Code Structure
Libraries Used:
•	d3.v6.min.js: For creating dynamic and interactive data visualizations for the data.
•	topojson.v3.js: For mapping and handling geographic data efficiently.
Code Structure:
•	index.html → Defines the structure and layout of the visualization and the page.
•	styles.css → Styles the charts, maps, and overall interface for clarity and better viewing.
•	script.js → Handles data loading, processing, and visualization codes.
Live deployment Link: https://project1-visual-interfaces.vercel.app/
Github repository link: https://github.com/saadahmed540/Project1VisualInterfaces
Demo Video Link: https://drive.google.com/file/d/1CZV1nGNkjvkN6ihvNtIt-s7-DRW6qn-E/view?usp=sharing

How to Access & Run the Project:
1.	Clone the project from GitHub : https://github.com/saadahmed540/Project1VisualInterfaces
2.	Open index.html in a browser.
3.	Ensure that the data folder contains the required national_health_data_2024.csv and counties-10m.json files. These files contain the Health care and data of the counties.
4.	The application should load with interactive visualizations.

Challenges Faced:
1.	The initial challenge which I faced is the counties data was not getting reflected with choropleth. The I took reference of the tutorial mentioned in the document.
2.	Later I found difficulty in adding multiple attributes. At first, I was working with the 2 attributes later on I added more 2 attributes that’s when my whole work which I have done had to change, I did most of my debugging for them displaying the data.
3.	Another Challenged which I faced is selecting the colours and avoiding the traditional red, blue and green colours, it took lot of time for me to settle on the colours.
4.	And also, I faced challenge when adding the brushing technique, there was an error that the plot was getting selected but the data was not getting updated. It took a lot of time for me to debug the issue.
Future Enhancements:
•	Adding more Attributes: Allow users to compare additional health-related indicators.
•	Time-Series Data: Implement animations showing changes over time.
•	Improving the UI: Enhance map navigation and filtering options.

Use of AI & Collaboration with peers.
Throughout this project, I leveraged AI tools like ChatGPT for:
•	Debugging JavaScript errors which I faced in adding the multiple attributes where I was confused on how to manage the histograms and scatterplot. 
•	And also in the brushing technique, where I was able to select the data on the scatter plot but was unable to update on the histograms and the choropleth maps.
Additionally, I would like to thank my peers Hethu Sri Nadipudi, Mosaad Ahmed Mohammed and Viraj Kishore Charakanam who supported me with their insights on my page and colours and also provided me their valuable feedback.

