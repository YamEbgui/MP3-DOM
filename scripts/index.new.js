//variables section
let playingNow = 0;
let songsExistsInHtml = 0;
playlistsExistsInHtml = 0;



//Functions from past project that used in this MP3 page
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

function getSongFromId(songs , id){
  for(let i = 0; i < songs.length; i++){
    if (songs[i].id === id){
      return songs[i];
    }
  }
}


// Plays a song from the player.
//Playing a song means changing the visual indication of the currently playing song.
//@param {Number} songId - the ID of the song to play
function playSong(songId) {
  console.log(isIdExist(player.songs , songId));
  if (isIdExist(player.songs , songId) && playingNow !== songId) {
    playingNow = songId;
    let songEl = document.getElementById(playingNow+"");
    let playSongImage=createElement("img", [],  ["playSong-image"],  {src : "./images/playSong.png"});
    playSongImage.style.justifySelf="center";
    songEl.append(playSongImage);
    setTimeout(function(){ playSongImage.remove(); playSong(playingNow+1);},getSongFromId(player.songs,playingNow).duration * 10);
  }
  // console.log(isIdExist(player.songs,songId)+"  "+songId);
  // if (isIdExist(player.songs,songId) === 'false'){
  //   playingNow = 1;
  //   console.log("shut upppppp");
  //   playSong(1);
  // }else if(playingNow === songId){
  //   playingNow = songId;
  // }else{
  //   console.log(isIdExist(player.songs,songId)+"  "+songId);
  //   playingNow=songId;
  //   let songEl = document.getElementById(playingNow+"");
  //   let playSongImage=createElement("img", [],  ["playSong-image"],  {src : "./images/playSong.png"});
  //   songEl.append(playSongImage);
  //   console.log("playersongs:"+player.songs+"song id:"+songId);
  //   setTimeout(function(){ playSongImage.remove(); playSong(playingNow+1);},getSongFromId(player.songs,songId).duration * 1000);
  // }
}


//Removes a song from the player, and updates the DOM to match.
function removeSong(songId) {
player.songs=removeSongFromPlayerById(player.songs , songId);
let songEl = document.getElementById(songId+"");
songsExistsInHtml--;
songEl.remove();
}


//Adds a song to the player, and updates the DOM to match.
function addSong({ title, album, artist, duration, coverArt }) {
  console.log(title, album, artist, duration,coverArt);
  console.log(title, album, artist, duration,coverArt);
  addSongPlayer(title, album, artist, duration,coverArt);
  generateSongs();
}


//Acts on a click event on an element inside the songs list.
//Should handle clicks on play buttons and remove buttons of songs.
function handleSongClickEvent(event) {
  songIdToUse=event.target.parentElement.parentElement.parentElement.id;
  if (event.target.textContent === "Play"){
    playSong(songIdToUse);
  }else{
    removeSong(songIdToUse);
  }
}


//Handles a click event on the button that adds songs.
function handleAddSongEvent(event) {
  //creating variables from the inputs. "#inputs > input:nth-child(1)" => js path
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
  //building elements for left div
  const songTitle = createElement("span", [title],  ["song-title"]);
  const songAlbum = createElement("span", [album],  ["song-album"]);
  const songArtist = createElement("span", [artist],  ["song-artist"]);
  const songImage = createElement("img", [],  ["song-image"],  {src : coverArt});
  const songDetails = createElement("div", [songTitle , songAlbum , songArtist], ["song-details"]);
  //building elements for right div
  const songDuration = createElement("div", [timeConventor(duration)],  ["song-duration"]);
  const playButton = createElement("button", "Play", ["play-button"]);
  const removeButton = createElement("button", "Remove", ["remove-button"]);
  const songActions=createElement("div", [playButton , removeButton], ["song-actions"]);
  playButton.addEventListener("click",handleSongClickEvent);
  removeButton.addEventListener("click",handleSongClickEvent);
  //Changing duration color by the length of the song
  if (duration < 120){
      songDuration.style.color ="green";
  }else if (duration > 420){
      songDuration.style.color ="red";
  }else {
      songDuration.style.color = "yellow";
  }
  // creating the children sides of each song 
  let left=createElement("div",[songImage,songDetails], ["left"]);
  let right=createElement("div",[songDuration,songActions], ["right"]);
  const children = [left,right]
  const classes = ["song"]
  const attrs = {id:id ,onclick: `playSong(${id})` }
  return createElement("div", children, classes, attrs)
}


//Creates a playlist DOM element based on a playlist object.
function createPlaylistElement({ id, name, songs }) {
  //create left div of playlist
  const playlistName = createElement("span", [name],  ["playlist-name"]);
  let left=createElement("div",[playlistName], ["left"]);
  //create right div of playlist
  const playlistlength = createElement("span", [songs.length + " songs"],  ["playlist-length"]);
  const playlistDur = createElement("span",[timeConventor(playlistDuration(id))] ,  ["playlist-duration"]);
  let right=createElement("div",[playlistlength,playlistDur], ["right"]);
  const classes = ["playlist"]
  const attrs = {}
  return createElement("div", [left,right], classes, attrs)
}


//Creates a new DOM element.
function createElement(tagName, children = [], classes = [], attributes = {}) {
  let newElement = document.createElement(tagName);
  newElement.append(...children);
  newElement.classList.add(...classes);
  for ( let key in attributes){
      newElement.setAttribute(key , attributes[key] );
  }
  return newElement;
}



//Inserts all songs in the player as DOM elements into the songs list.
function generateSongs() {
  if(songsExistsInHtml != 0){
    let songDiv=document.getElementById("songs");
    let elementToRemove=songDiv.firstElementChild;
    while(songDiv.children.length != 1){
      elementToRemove=songDiv.children[1];
      songDiv.removeChild(elementToRemove);
    }
    songsExistsInHtml=0;
  }
  let arrSongs= player.songs;
  arrSongs = arrSongs.sort((a,b)=> {if(a['title'].toLowerCase() < b['title'].toLowerCase()) return -1});
  for (let i = songsExistsInHtml ; i < player.songs.length; i++){
      document.getElementById("songs").append(createSongElement(arrSongs[i]));
      songsExistsInHtml++;
  }
}

// Inserts all playlists in the player as DOM elements into the playlists list.
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
