// add tags to the post code

// Get references to the input field, the tags container, and the add tag button
const tagsInput = document.getElementById("tags-input");
const tagsContainer = document.getElementById("tags-container");
const addTagButton = document.getElementById("add-tag");
const tagData = [];
// Event listener for the add tag button
addTagButton.addEventListener("click", () => {
  const tagText = tagsInput.value.trim();

  if (tagText !== "") {
    // Prepare an object to store the tag data
    tagData.push(tagText);
    console.log(tagData);
    const tagElement = document.createElement("div");
    tagElement.className =
      "text-white bg-blue-500 px-2 py-1 rounded-md mr-2 mt-2 flex items-center";
    tagElement.innerHTML = `
            #${tagText}
            <button class="ml-2 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

    // Event listener for removing the tag when the close button is clicked
    const closeButton = tagElement.querySelector("button");
    closeButton.addEventListener("click", () => {
      // Remove the tag from the tagData array
      const tagIndex = tagData.indexOf(tagText);
      if (tagIndex !== -1) {
        tagData.splice(tagIndex, 1);
      }
      tagElement.remove();
      console.log(tagData); // Log the updated tagData array
    });
    // Update the hidden input field with the JSON stringified tagData
    document.getElementById("tags").value = JSON.stringify(tagData);
    document.getElementById("tags").value = tagData.join(",");

    tagsContainer.appendChild(tagElement);
    tagsInput.value = "";
  }
});

// adding markdown
