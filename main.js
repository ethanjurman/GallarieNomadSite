// pull the entry for the main page (you can find this in contentful, info panel)
const mainPageEntry = "2FDoqwaVPKZiumNtdH86Ad";

const getURL = (entryItem) => {
  return entryItem.fields.file.url;
};

const buildProfileCard = (entryItem) => {
  const profileArea = document.querySelector(
    ".gallarie-about-us-grid-container"
  );
  const descriptionCard = document.createElement("div");
  descriptionCard.innerHTML = `
  <div class="gallerie-profile-card-container card text-white bg-dark mb-3">
    <div class="profile-card card-body">
      <img src="${getURL(entryItem.fields.profilePhoto)}">
      <div>
        <h5 class="text-success card-title">${entryItem.fields.name}</h5>
        <p class="card-text">${entryItem.fields.description}</p>
      </div>
    </div>
  </div>
  `;

  profileArea.appendChild(descriptionCard);
};

const buildContactCard = (entryItem) => {
  const contactArea = document.querySelector(".other-contact-block");

  const contactCard = document.createElement("div");
  contactCard.innerHTML = `
    <div class="card text-white bg-dark mb-3">
      <div class="card-body">
        <div class="card-text">
            ${documentToHtmlString(entryItem.fields.body)}
        </div>
      </div>
    </div>
  `;
  contactArea.appendChild(contactCard);
};

Promise.all([client.getEntry("5A12U9FuNqpT2EZ0U3k54d"), client.getEntries()])
  .then(([galleryItems, ...entries]) => {
    const bios = entries[0].items.filter(
      (entry) => entry.sys.contentType.sys.id === "bio"
    );
    const contactBlock = entries[0].items.filter(
      (entry) => entry.sys.contentType.sys.id === "contactBlock"
    );
    galleryItems.fields.images.forEach((entryItem) => {
      const img = document.createElement("img");
      img.setAttribute("src", getURL(entryItem));
      document.querySelector(".gallarie-nomad-carousel").appendChild(img);
    });

    bios
      .sort((entryItem) => (entryItem.fields.name.includes("Josh") ? -1 : 1))
      .forEach((entryItem) => {
        buildProfileCard(entryItem);
      });

    contactBlock.forEach((entryItem) => {
      buildContactCard(entryItem);
    });
  })
  .catch(console.error);

// JavaScript to scroll images
function scrollImages(direction) {
  var container = document.querySelector(".gallarie-nomad-carousel");
  container.scrollLeft += direction * 410; // Adjust the 100 to how many pixels you want to scroll
}
