//help function that turn time in seconds to ms:sc
function timeConventor(duration){
    if (duration/60 < 10){
      if (duration%60 < 10){
        return "0"+Math.floor(duration/60)+ ":0" + duration%60;
      }else{
        return "0"+Math.floor(duration/60)+ ":" + duration%60;
      }
    }else if (duration%60 < 10){
      return Math.floor(duration/60)+ ":0" + duration%60;
    }else{
      return Math.floor(duration/60)+ ":" + duration%60;
    }
  
}

// 3 functions that used for playlistDuration that get id of playlist and return his duration
function returnPropItem(playerList,id){
    if (playerList.length === 0){
      throw "non exist id";
    }else if (playerList[0].id === id){
      return playerList[0];
    }else{
      return returnPropItem(playerList.slice(1),id);
    }
}

function isIdExist(List , id){
    for(let i = 0; i < List.length; i++){
      if (List[i].id === id){
        return true;
      }
    }
    return false;
}

function playlistDuration(id) {
    let duration = 0;
    if (!isIdExist(player.playlists , id)){
      throw "non exist id for playlist";
    }else{
      for (let i = 0 ; i < returnPropItem(player.playlists,id).songs.length ; i++){
        duration += returnPropItem(player.songs,returnPropItem(player.playlists,id).songs[i]).duration;
      }
    }
    return duration;
}

function numberForId(playerList){
    let arr=[];
    for (let i = 0 ; i < playerList.length ; i++){
      arr.push(playerList[i].id);
    }
    if (arr.length === 0){
      return 1;
    }
    arr=arr.sort(function (a, b) { return a - b;  });
    let id = 0;
    for (let i = 0 ;  i < arr.length ; i++){
      if(arr[i] > (i+1)){
        return i+1;
      }
    }
    id = arr.length+1;
    return id;
}

function timeConventorToSeconds(time){
    let arr = time.split('');
    let min = (parseInt(arr[0])*10)+parseInt(arr[1]);
    let sec = parseInt(arr[3]+arr[4]);
    return (min * 60) + sec;
}

function removeSongFromPlayerById(songs , id){
  if (songs.length === 0){
    return [];
  }else if(songs[0].id === id){
    return removeSongFromPlayerById(songs.slice(1) , id);
  }else{
    return [songs[0]].concat(removeSongFromPlayerById(songs.slice(1) , id));
  }
}

function addSongPlayer(title, album, artist, duration, coverArt, id) {
    let newId=id;
    if (isIdExist(player.songs , id)){
      throw "this id is taken";
    }else if(id=== undefined){
      newId = numberForId(player.songs);
    }
    player.songs.push(new Object());
    player.songs[player.songs.length-1].id= newId;
    player.songs[player.songs.length-1].duration= timeConventorToSeconds(duration);
    player.songs[player.songs.length-1].title= title;
    player.songs[player.songs.length-1].artist= artist;
    player.songs[player.songs.length-1].album= album;
    player.songs[player.songs.length-1].coverArt= coverArt;
}


/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {Number} songId - the ID of the song to play
 */
function playSong(songId) {

}


//Removes a song from the player, and updates the DOM to match.
function removeSong(songId) {
  player.songs=removeSongFromPlayerById(player.songs , songId);
  let songEl = document.getElementById(songId+"");
  songEl.remove();
}


//Adds a song to the player, and updates the DOM to match.
function addSong({ title, album, artist, duration, coverArt }) {
    console.log(title, album, artist, duration,coverArt);
    console.log(title, album, artist, duration,coverArt);
    addSongPlayer(title, album, artist, duration,coverArt);
    generateSongs();
}

/**
 * Acts on a click event on an element inside the songs list.
 * Should handle clicks on play buttons and remove buttons of songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleSongClickEvent(event) {
    // Your code here
}

/**
 * Handles a click event on the button that adds songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleAddSongEvent(event) {
    let titleNew=document.querySelector("#inputs > input:nth-child(1)").value; 
    let albumNew=document.querySelector("#inputs > input:nth-child(2)").value; 
    let artistNew=document.querySelector("#inputs > input:nth-child(3)").value; 
    let durationNew=document.querySelector("#inputs > input:nth-child(4)").value; 
    let coverNew=document.querySelector("#inputs > input:nth-child(5)").value; 
    console.log( coverNew);
    addSong({ title : titleNew, album : albumNew, artist : artistNew, duration : durationNew, coverArt : coverNew })
}


// Creates a song DOM element based on a song object.
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const songTitle = createElement("span", [title],  ["song-title"]);
    const songAlbum = createElement("span", [album],  ["song-album"]);
    const songArtist = createElement("span", [artist],  ["song-artist"]);
    const songDuration = createElement("div", [timeConventor(duration)],  ["song-duration"]);
    const songImage = createElement("img", [],  ["song-image"],  {src : coverArt});
    const songDetails = createElement("div", [songTitle , songAlbum , songArtist], ["song-details"]);
    const songActions=createElement("div", [createElement("button", "Play", ["play-button"]),createElement("button", "Remove", ["remove-button"])], ["song-actions"]);
    if (duration < 120){
        songDuration.style.color ="green";
    }else if (duration > 420){
        songDuration.style.color ="red";
    }else {
        songDuration.style.color = "yellow";
    }
    console.log(coverArt);
    console.log(songImage);
    let left=createElement("div",[songImage,songDetails], ["left"]);
    let right=createElement("div",[songDuration,songActions], ["right"]);
    const children = [left,right]
    const classes = ["song"]
    const attrs = {id:id ,onclick: `playSong(${id})` }
    return createElement("div", children, classes, attrs)
}


 //Creates a playlist DOM element based on a playlist object.
 function createPlaylistElement({ id, name, songs }) {
    const playlistName = createElement("span", [name],  ["playlist-name"]);
    let left=createElement("div",[playlistName], ["left"]);
    const playlistlength = createElement("span", [songs.length + " songs"],  ["playlist-length"]);
    const playlistDur = createElement("span",[playlistDuration(id)+""] ,  ["playlist-duration"]);
    let right=createElement("div",[playlistlength,playlistDur], ["right"]);
    const classes = ["playlist"]
    const attrs = {}
    return createElement("div", [left,right], classes, attrs)
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"}, {click: (...) => {...}})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 * @param {Object} eventListeners - the event listeners on the element
 */
function createElement(tagName, children = [], classes = [], attributes = {}) {
    let newElement = document.createElement(tagName);
    newElement.append(...children);
    newElement.classList.add(...classes);
    for ( let key in attributes){
        newElement.setAttribute(key , attributes[key] );
    }
    return newElement;
}


/**
 * Inserts all songs in the player as DOM elements into the songs list.
 */
let songsExistsInHtml = 0;
function generateSongs() {
    for (let i = songsExistsInHtml ; i < player.songs.length; i++){
        document.getElementById("songs").append(createSongElement(player.songs[i]));
        songsExistsInHtml++;
    }
}


// Inserts all playlists in the player as DOM elements into the playlists list.
playlistsExistsInHtml = 0;
function generatePlaylists() {
    for (let i = playlistsExistsInHtml ; i < player.playlists.length; i++){
        document.getElementById("playlists").append(createPlaylistElement(player.playlists[i]));
        playlistsExistsInHtml++;
    }
}

// Creating the page structure
generateSongs()
generatePlaylists()

// Making the add-song-button actually do something
document.getElementById("add-button").addEventListener("click", handleAddSongEvent)
removeSong(4);
removeSong(1);
