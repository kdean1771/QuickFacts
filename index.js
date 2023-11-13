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
          let state;
          let city;

          for (const part of parts) {
            if (part.types.includes("administrative_area_level_1") && !state) {
              state = part.long_name;
              console.log(state);
            }

            if (part.types.includes("locality") && !city) {
              city = part.long_name;
              console.log(city);
            }

            // If both city and state have been set, we can break out of the loop early
            if (city && state) {
              break;
            }
          }
            
            
            
            if (city) {
              document.getElementById('infoArea').textContent = `City: ${city}, State: ${state}, Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
            
              let url5 = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${encodeURIComponent(city)}&explaintext=1&formatversion=2&format=json`;
            
              fetch(url5, {
                headers: {
                  'x-requested-with': 'anyValue'
                }
              })
              .then(response => response.json())
              .then(data => {
                let page = data.query.pages[0];
                if (!page.missing) {
                  const extract = page.extract;
                  if (extract.includes("may refer to:")) {
                    console.log('Ambiguous city name detected.');
            
                    let url6 = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${encodeURIComponent(city)},_${encodeURIComponent(state)}&explaintext=1&formatversion=2&format=json`;
            
                    return fetch(url6, {
                      headers: {
                        'x-requested-with': 'anyValue'
                      }
                    })
                    .then(response => response.json())
                    .then(data => {
                      let newPage = data.query.pages[0];
                      if (!newPage.missing) {
                        return newPage.extract;
                      }
                      return extract; // Fallback to the original extract if the new one is missing
                    });
                  }
                  return extract; // Not ambiguous, use the original extract
                }
                throw new Error('Wikipedia page missing');
              })
              .then(finalExtract => {
                if (finalExtract) {
                  randomsentence(finalExtract);
                }
              })
              .catch(error => {
                console.error('Error:', error);
                dataResultArea.textContent = `An error occurred while fetching information.`;
              });
            };
          });
        });
    });






corsbutton.addEventListener('click', function() {
  window.location.href = 'https://cors-anywhere.herokuapp.com/corsdemo';
})



document.querySelector('.control-button').addEventListener('click', function() {
  const button = this;
  
  // Apply a small scale transform when clicked
  button.style.transform = 'scale(0.9)';

  // Wait for a moment before running the bounce animation
  setTimeout(() => {
      button.classList.add('control-button-clicked');
  }, 100);

  // Remove the class after the animation completes
  button.addEventListener('animationend', () => {
      button.classList.remove('control-button-clicked');
      button.style.transform = 'scale(1)'; // Reset transform
  });
});