//Function to get the top ten posts from a subreddit and return promise
function getTopTen(subreddit,limit) {
  return fetch(`https://www.reddit.com/r/${subreddit}/top.json?&limit=${limit}&raw_json=1`)
    .then(response => response.json())
    .then(data => data.data.children)
}

//Function to take promise and display results in the DOM
function processResults(results) {
  return new Promise((resolve) => {
    let posts = [];
    results.forEach(result => {

      //if result.data.media_metadata is defined then loop through the array and get the image url
      let images = []
      if (result.data.media_metadata) {
        for (const key in result.data.media_metadata) {
          let image = result.data.media_metadata[key].p[result.data.media_metadata[key].p.length - 1].u
          images.push(image)
        }
      }
      //else get the image url from the data.url
      else {
        images.push(result.data.url)
      }


      //build an array of objects with the image url and the title and the user name
      //loop through images
      images.forEach(image => {
        posts.push({
          image: image,
          title: result.data.title,
          user: result.data.author
        })
      })

    })
    return resolve (posts)
  })
}

//function to remove quotes from a string
function removeQuotes(string) {
  return string.replace(/['"]+/g, '')
}

function displayResult(results) {
  results.then(posts =>{

    //Choose a random image from the array of objects
    let randomPost = posts[Math.floor(Math.random() * posts.length)]
    document.getElementById("results").innerHTML = `
        <div class="container">
        <div class="card">
            <div class="card-image">
                <img src="${randomPost.image}" />
            </div>
            <div class="card-content">
                <h3 class="title">&ldquo;${removeQuotes(randomPost.title)}&rdquo;</h3>
                <p class="author"> - ${randomPost.user}</p>
            </div>
        </div>
        </div>
        `
  })
}

//Get top 10 from dalle2 and display results
getTopTen("dalle2",10).then(results => {
  displayResult(processResults(results))
  //start an infinite loop to get a new random post every 5 seconds
  setInterval(() => {
    displayResult(processResults(results))
  }, 60000)
})
