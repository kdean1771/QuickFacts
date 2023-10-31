const getcoordsbutton = document.getElementById("get-coords")
const dataResultArea = document.getElementById("mainResults")

function removeHtmlTags(input) {
  return input.replace(/<[^>]+>|\([^)]+\)/g, "");
}

let finalExtract; // Variable to store the extract

let url3 = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=Monkland&explaintext=1&formatversion=2&format=json`;

fetch(url3, {
  headers: {
    'x-requested-with': 'anyValue'
  }
})
.then(response => response.json())
.then(data => {
  const extract = data.query.pages[0].extract;

  if (extract && extract.includes("may refer to:")) {
    console.log('Ambiguous city name detected.');
    
    let url4 = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=Monkland,_Queensland&explaintext=1&formatversion=2&format=json`;
    
    return fetch(url4, {
      headers: {
        'x-requested-with': 'anyValue'
      }
    })
    .then(response => response.json())
    .then(data => data.query.pages[0].extract); // Return the new extract
  }
  
  return extract; // Return the original extract
})
.then(result => {
  finalExtract = result; // Save the final extract
  console.log(finalExtract); // Logs the final extract
})
.catch(error => {
  console.error('Error:', error);
});









getcoordsbutton.addEventListener('click', async (event) => {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude)
        console.log(finalExtract)

        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyBFidbPI4SMVPBI4233idnsxiLxJ0z-Iog`;
        fetch(url)
        .then(response => response.json())
        .then( data => {
          console.log(data)
          let parts = data.results[0].address_components;
          parts.forEach(part => {
            
            let state;

            for (const part of parts) {
              if (part.types.includes("administrative_area_level_1")) {
                state = part.long_name;
                console.log(state);
              }
            
              if (part.types.includes("locality")) {
                city = part.long_name;
                console.log(city);
              }
            }
            
            
            
            if (city) {
              dataResultArea.textContent = `City: ${city} ${state}, Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`

              let finalExtractagain; // Variable to store the extract

              let url5 = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${city}&explaintext=1&formatversion=2&format=json`;

              fetch(url5, {
                headers: {
                  'x-requested-with': 'anyValue'
                }
              })
              .then(response => response.json())
              .then(data => {
                const extract = data.query.pages[0].extract;

                if (extract && extract.includes("may refer to:")) {
                  console.log('Ambiguous city name detected.');
    
                  let url6 = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${city},_${state}&explaintext=1&formatversion=2&format=json`;
    
                  return fetch(url6, {
                    headers: {
                      'x-requested-with': 'anyValue'
                    }
                  })
                  .then(response => response.json())
                  .then(data => data.query.pages[0].extract); // Return the new extract
                }
  
                return extract; // Return the original extract
              })
              .then(result => {
                finalExtractagain = result; // Save the final extract
                console.log(finalExtractagain); // Logs the final extract
                dataResultArea.textContent = finalExtractagain
              })
              .catch(error => {
                console.error('Error:', error);
              });
            };
          });
        });
    });

})
