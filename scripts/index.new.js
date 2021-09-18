//variables section
let playingNow = 0
let songsExistsInHtml = 0
playlistsExistsInHtml = 0

//Functions from past project that used in this MP3 page
//help function that turn time in seconds to ms:sc
function timeConventor(duration) {
    if (duration / 60 < 10) {
        if (duration % 60 < 10) {
            return "0" + Math.floor(duration / 60) + ":0" + (duration % 60)
        } else {
            return "0" + Math.floor(duration / 60) + ":" + (duration % 60)
        }
    } else if (duration % 60 < 10) {
        return Math.floor(duration / 60) + ":0" + (duration % 60)
    } else {
        return Math.floor(duration / 60) + ":" + (duration % 60)
    }
}
// 3 functions that used for playlistDuration that get id of playlist and return his duration
function returnPropItem(playerList, id) {
    if (playerList.length === 0) {
        throw "non exist id"
    } else if (playerList[0].id === id) {
        return playerList[0]
    } else {
        return returnPropItem(playerList.slice(1), id)
    }
}
//get list of items and check if exist by checking is id.
function isIdExist(List, id) {
    for (let i = 0; i < List.length; i++) {
        if (List[i].id === id) {
            return true
        }
    }
    return false
}
//return the playlist duration by sums up all songs in the playlist
function playlistDuration(id) {
    let duration = 0
    if (!isIdExist(player.playlists, id)) {
        throw "non exist id for playlist"
    } else {
        for (let i = 0; i < returnPropItem(player.playlists, id).songs.length; i++) {
            duration += returnPropItem(player.songs, returnPropItem(player.playlists, id).songs[i]).duration
        }
    }
    return duration
}
//return Id for new song that I add to the songs list
function numberForId(playerList) {
    let arr = []
    for (let i = 0; i < playerList.length; i++) {
        arr.push(playerList[i].id)
    }
    if (arr.length === 0) {
        return 1
    }
    arr = arr.sort(function (a, b) {
        return a - b
    })
    let id = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > i + 1) {
            return i + 1
        }
    }
    id = arr.length + 1
    return id
}
//gets time by ms:ss and return it in seconds
function timeConventorToSeconds(time) {
    let arr = time.split("")
    let min = parseInt(arr[0]) * 10 + parseInt(arr[1])
    let sec = parseInt(arr[3] + arr[4])
    return min * 60 + sec
}
// delete song from songs list of the player
function removeSongFromPlayerById(songs, id) {
    if (songs.length === 0) {
        return []
    } else if (songs[0].id === id) {
        return removeSongFromPlayerById(songs.slice(1), id)
    } else {
        return [songs[0]].concat(removeSongFromPlayerById(songs.slice(1), id))
    }
}
// function that adds song(creates object- song) to the songs list of player
function addSongPlayer(title, album, artist, duration, coverArt, id) {
    let newId = id
    if (isIdExist(player.songs, id)) {
        throw "this id is taken"
    } else if (id === undefined) {
        newId = numberForId(player.songs)
    }
    player.songs.push(new Object())
    player.songs[player.songs.length - 1].id = newId
    player.songs[player.songs.length - 1].duration = timeConventorToSeconds(duration)
    player.songs[player.songs.length - 1].title = title
    player.songs[player.songs.length - 1].artist = artist
    player.songs[player.songs.length - 1].album = album
    player.songs[player.songs.length - 1].coverArt = coverArt
}
//return song from the player songs list
function getSongFromId(songs, id) {
    for (let i = 0; i < songs.length; i++) {
        if (songs[i].id === id) {
            return songs[i]
        }
    }
}
//delete song from songs list(list of the playlist)
function removeFromPlaylistSongsList(songs, id) {
    if (songs.length === 0) {
        return []
    } else if (songs[0] === id) {
        return removeFromPlaylistSongsList(songs.slice(1), id)
    } else {
        return [songs[0]].concat(removeFromPlaylistSongsList(songs.slice(1), id))
    }
}
//check if song exist in the playlists
function isExistOnPlaylist(playlists, id) {
    for (let i = 0; i < playlists.length; i++) {
        for (let j = 0; j < playlists[i].songs.length; j++) {
            if (playlists[i].songs[j] === id) {
                return true
            }
        }
    }
    return false
}






//new functions
//remove empty playlist from the list of playlists
function removeEmptyPlaylist(playlists) {
    if (playlists.length === 0) {
        return []
    } else if (playlists[0].songs.length === 0) {
        return removeEmptyPlaylist(playlists.slice(1))
    } else {
        return [playlists[0]].concat(removeEmptyPlaylist(playlists.slice(1)))
    }
}
//remove the images of Playsong from the songs elements.
function removePlayImageFromSongs() {
    let songDiv = document.getElementById("songs")
    let elementToRemove = undefined
    for (let i = 0; i < songDiv.children.length; i++) {
        elementToRemove = songDiv.children[i]
        if (elementToRemove.className === "song") {
            for (let r = 0; r < elementToRemove.children.length; r++) {
                if (elementToRemove.children[r].className === "playSong-image") {
                    elementToRemove.children[r].remove()
                }
            }
        }
    }
}


// Plays a song from the player.
// Playing a song means showing image of play button  on the song section
function playSong(songId) {
    if (isIdExist(player.songs, parseInt(songId)) && playingNow !== parseInt(songId)) {
        removePlayImageFromSongs()
        console.log(playingNow)
        playingNow = parseInt(songId)
        let songEl = document.getElementById(playingNow + "")
        let playSongImage = createElement("img", [], ["playSong-image"], { src: "./images/playSong.png" })
        playSongImage.style.justifySelf = "center"
        songEl.append(playSongImage)
        setTimeout(function () {
            removePlayImageFromSongs()
            playSong(playingNow + 1)
        }, getSongFromId(player.songs, playingNow).duration * 1000)
    } 
}

//Removes a song from the player, and updates the DOM to match.
function removeSong(songId) {
    player.songs = removeSongFromPlayerById(player.songs, parseInt(songId))
    //checking if song exist in playlists and remove it if exist
    if (isExistOnPlaylist(player.playlists, parseInt(songId))) {
        for (let i = 0; i < player.playlists.length; i++) {
            player.playlists[i].songs = removeFromPlaylistSongsList(player.playlists[i].songs, parseInt(songId))
        }
        player.playlists = removeEmptyPlaylist(player.playlists)
        generatePlaylists()
    }
    let songEl = document.getElementById(songId + "")
    songsExistsInHtml--
    songEl.remove()
}

//Adds a song to the player, and updates the DOM to match.
function addSong({ title, album, artist, duration, coverArt }) {
    addSongPlayer(title, album, artist, duration, coverArt)
    generateSongs()
}

//Acts on a click event on an element inside the songs list.
//Should handle clicks on play buttons and remove buttons of songs.
function handleSongClickEvent(event) {
    songIdToUse = event.target.parentElement.parentElement.parentElement.id
    if (event.target.textContent === "Play") {
        playSong(songIdToUse)
    } else {
        removeSong(songIdToUse)
    }
}

//Handles a click event on the button that adds songs.
function handleAddSongEvent(event) {
    //creating variables from the inputs. "#inputs > input:nth-child(1)" => js path
    let titleNew = document.querySelector("#inputs > input:nth-child(1)").value
    let albumNew = document.querySelector("#inputs > input:nth-child(2)").value
    let artistNew = document.querySelector("#inputs > input:nth-child(3)").value
    let durationNew = document.querySelector("#inputs > input:nth-child(4)").value
    let coverNew = document.querySelector("#inputs > input:nth-child(5)").value
    addSong({ title: titleNew, album: albumNew, artist: artistNew, duration: durationNew, coverArt: coverNew })
}

// Creates a song DOM element based on a song object.
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    //building elements for left div
    const songTitle = createElement("span", [title], ["song-title"])
    const songAlbum = createElement("span", [album], ["song-album"])
    const songArtist = createElement("span", [artist], ["song-artist"])
    const songImage = createElement("img", [], ["song-image"], { src: coverArt })
    const songDetails = createElement("div", [songTitle, songAlbum, songArtist], ["song-details"])
    //building elements for right div
    const songDuration = createElement("div", [timeConventor(duration)], ["song-duration"])
    const playButton = createElement("button", "Play", ["play-button"])
    const removeButton = createElement("button", "Remove", ["remove-button"])
    const songActions = createElement("div", [playButton, removeButton], ["song-actions"])
    playButton.addEventListener("click", handleSongClickEvent)
    removeButton.addEventListener("click", handleSongClickEvent)
    //Changing duration color by the length of the song
    if (duration < 120) {
        songDuration.style.color = "green"
    } else if (duration > 420) {
        songDuration.style.color = "red"
    } else {
        let scale = (duration - 120) / 300;
        songDuration.style.color = `rgb(${scale*255} , ${(1 - scale) * 255} ,0)`
    }
    // creating the children sides of each song
    let left = createElement("div", [songImage, songDetails], ["left"])
    let right = createElement("div", [songDuration, songActions], ["right"])
    const children = [left, right]
    const classes = ["song"]
    const attrs = { id: id, onclick: `playSong(${id})` }
    return createElement("div", children, classes, attrs)
}

//Creates a playlist DOM element based on a playlist object.
function createPlaylistElement({ id, name, songs }) {
    //create left div of playlist
    const playlistName = createElement("span", [name], ["playlist-name"])
    let left = createElement("div", [playlistName], ["left"])
    //create right div of playlist
    const playlistlength = createElement("span", [songs.length + " songs"], ["playlist-length"])
    const playlistDur = createElement("span", [timeConventor(playlistDuration(id))], ["playlist-duration"])
    let right = createElement("div", [playlistlength, playlistDur], ["right"])
    const classes = ["playlist"]
    const attrs = {}
    return createElement("div", [left, right], classes, attrs)
}

//Creates a new DOM element.
function createElement(tagName, children = [], classes = [], attributes = {}) {
    let newElement = document.createElement(tagName)
    newElement.append(...children)
    newElement.classList.add(...classes)
    for (let key in attributes) {
        newElement.setAttribute(key, attributes[key])
    }
    return newElement
}

//Inserts all songs in the player as DOM elements into the songs list.
function generateSongs() {
    //check if the function worked before and remove the elements it create
    if (songsExistsInHtml != 0) {
        let songDiv = document.getElementById("songs")
        let elementToRemove = songDiv.firstElementChild
        while (songDiv.children.length != 1) {
            elementToRemove = songDiv.children[1]
            songDiv.removeChild(elementToRemove)
        }
        songsExistsInHtml = 0
    }
    //sort the player songs list by their title
    let arrSongs = player.songs
    arrSongs = arrSongs.sort((a, b) => {
        if (a["title"].toLowerCase() < b["title"].toLowerCase()) return -1
    })
    player.songs = arrSongs
    //create elements in DOM for the song list that exist in the player
    for (let i = songsExistsInHtml; i < player.songs.length; i++) {
        document.getElementById("songs").append(createSongElement(arrSongs[i]))
        songsExistsInHtml++
    }
}

// Inserts all playlists in the player as DOM elements into the playlists list.
function generatePlaylists() {
    //check if the function worked before and remove the elements it create
    if (playlistsExistsInHtml != 0) {
        let playlistDiv = document.getElementById("playlists")
        let elementToRemove = playlistDiv.firstElementChild
        while (playlistDiv.children.length != 1) {
            elementToRemove = playlistDiv.children[1]
            playlistDiv.removeChild(elementToRemove)
        }
        playlistsExistsInHtml = 0
    }
    //sort the player playlists list by their title
    let arrPlaylists = player.playlists
    arrPlaylists = arrPlaylists.sort((a, b) => {
        if (a["name"].toLowerCase() < b["name"].toLowerCase()) return -1
    })
    player.playlists = arrPlaylists
    //create elements in DOM for the playlist list that exist in the player
    for (let i = playlistsExistsInHtml; i < player.playlists.length; i++) {
        document.getElementById("playlists").append(createPlaylistElement(player.playlists[i]))
        playlistsExistsInHtml++
    }
}

// Creating the page structure
generateSongs()
generatePlaylists()

// Making the add-song-button actually do something
document.getElementById("add-button").addEventListener("click", handleAddSongEvent)
