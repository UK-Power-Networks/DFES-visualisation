# UK Power Networks DFES 2023

**This directory contains a prototype tool and none of the data should be taken as real or representative of the scenarios listed.**


## About this visualisation

To make a new page for a new year update, copy the folder and commit the changes to the main branch. This will then be reflected in a few minutes with the webpage being accessible.

Things to update on the index page:
- check all logos are correct
- update the year in the title and h1 tags
- check all weblinks work and update where needed e.g. lsoa/msoa to be updated to 21 from 11
- check emails are correct
- Update the FAQ and text



ANNUAL UPDATE PROCESS
- Update all mapping table json files in data/, using the latest mapping file from ERM, only needs to be updated if boundaries are updated in the DFES
- resources/config.js - update geojsons and layer names, only needs to be updated if boundaries are updated in the DFES
- data/maps - update geojson files, we got this from open innovations this year, only needs to be updated if boundaries are updated in the DFES
- convert dfes files into necessary shape with R (script saved on sharepoint)
- replace files in data/scenarios/lsoa with new dfes files from the R script
- replace files in data/scenarios/msoa with new dfes files from the R script
- add any new parameters to index and configuration using the info on that page
