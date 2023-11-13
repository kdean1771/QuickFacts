const getcoordsbutton = document.getElementById("get-coords")
const dataResultArea = document.getElementById("mainResults")
const corsbutton = document.getElementById("get-cors")

function removeHtmlTags(input) {
  return input.replace(/<[^>]+>|\([^)]+\)/g, "");
}


function randomsentence(finalExtractagain) {
  let sentences = finalExtractagain.split(/(?<!\d)\.(?!\d)/).map(s => s.trim()).filter(s => s);

  // Check if there are sentences available
  if (sentences && sentences.length) {
    // Choose a random sentence.
    let randomSentence = sentences[Math.floor(Math.random() * sentences.length)];

    // Display the random sentence in the data results area.
    let dataResultArea = document.getElementById('mainResults');
    dataResultArea.textContent = randomSentence;
  } else {
    // If no sentences are found, display the original extract.
    let dataResultArea = document.getElementById('mainResults');
    dataResultArea.textContent = extract;
  }
}


let finalExtract; // Variable to store the extract











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
                randomsentence(finalExtractagain);
              })
              .catch(error => {
                console.error('Error:', error);
              });
            };
          });
        });
    });

})




corsbutton.addEventListener('click', function() {
  window.location.href = 'https://cors-anywhere.herokuapp.com/corsdemo';
})