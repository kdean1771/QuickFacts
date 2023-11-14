const getcoordsbutton = document.getElementById("get-coords")
const dataResultArea = document.getElementById("mainResults")
const corsbutton = document.getElementById("get-cors")
const searchbutton = document.getElementById("searchonline")

function removeHtmlTags(input) {
  return input.replace(/<[^>]+>|\([^)]+\)/g, "");
}


function randomsentence(finalExtractagain) {
  let sentences = finalExtractagain.split(/(?<!\d)\.(?!\d)/).map(s => s.trim()).filter(s => s);

  if (sentences && sentences.length) {
    let randomSentence = sentences[Math.floor(Math.random() * sentences.length)];

    let dataResultArea = document.getElementById('mainResults');
    dataResultArea.textContent = randomSentence;
  } else {
    let dataResultArea = document.getElementById('mainResults');
    dataResultArea.textContent = extract;
  }
}


let finalExtract;

let globalCity;
let globalState;









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

            if (city && state) {
              globalCity = city;
              globalState = state;
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
                      return extract;
                    });
                  }
                  return extract;
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

searchbutton.addEventListener('click', function() {
  if (globalCity && globalState) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(globalCity)}+${encodeURIComponent(globalState)}`;
  } else {
      console.error('City or state is not defined.');
  }
});



document.querySelector('.control-button').addEventListener('click', function() {
  const button = this;
  
  button.style.transform = 'scale(0.9)';

  setTimeout(() => {
      button.classList.add('control-button-clicked');
  }, 100);

  button.addEventListener('animationend', () => {
      button.classList.remove('control-button-clicked');
      button.style.transform = 'scale(1)';
  });
});