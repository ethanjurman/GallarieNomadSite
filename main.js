// pull the entry for the main page (you can find this in contentful, info panel)
const mainPageEntry = "2FDoqwaVPKZiumNtdH86Ad";

const imagesLoaded = false;

const getURL = (entryItem, ...options) => {
  return entryItem.fields.file.url + '?' + options.join('&');
};

const reveal = (id) => {
  const expanded = document.getElementById(`${id}-gallery`).style.height === '640px';
  document.getElementById(`${id}-gallery`).style.height = expanded ? "0px" : "640px";
}

const openLarge = (url) => {
  document.getElementById('modal-image').src = url;
  document.querySelector('.modal-background').style.zIndex = '1';
  document.querySelector('.modal-background').style.opacity = 1;
  document.querySelector('.gallerie-nomad-modal').style.opacity = 1;
  document.querySelector('.gallerie-nomad-modal').style.zIndex = '1';
}

const closeLarge = () => {
  document.querySelector('.gallerie-nomad-modal').style.opacity = 0;
  setTimeout(() => {
    document.getElementById('modal-image').src = '';
    document.querySelector('.gallerie-nomad-modal').style.zIndex = -1;
    document.querySelector('.modal-background').style.zIndex = -1;
    document.querySelector('.modal-background').style.opacity = 0;
  }, 500);
}

const buildProfileCard = (entryItem) => {
  const profileArea = document.querySelector(
    ".gallerie-about-us-grid-container"
  );
  const descriptionCard = document.createElement("div");
  const instagramLink = entryItem.fields.links && entryItem.fields.links.find(link => link.includes('instagram')) || '';
  descriptionCard.innerHTML = `
  <div class="gallerie-profile-card-container card text-white bg-dark mb-3">
    <div class="profile-card card-body">
      <img src="${getURL(entryItem.fields.profilePhoto)}">
      <div>
        <h5 class="text-success card-title font-chiller">${entryItem.fields.name}</h5>
        <p class="card-text">${entryItem.fields.description}</p>
      </div>
    </div>
    ${entryItem.fields.images ? `<div id="${entryItem.sys.id}-button" class="btn btn-primary text-success" onclick="reveal('${entryItem.sys.id}')">${instagramLink ? 'Portfolio & Contact' : 'Images'}</div>` : ''}
    <div id="${entryItem.sys.id}-gallery" class="profile-gallery-container" style="height: 0px;">
      ${instagramLink ? `<a href="${instagramLink}" target="_blank" >${instagramLink.split('https://www.')[1]}</a>` : ''}
      <div class="profile-gallery">
        ${(entryItem.fields.images || []).map((image) => {
    return `<img src="${getURL(image, 'w=100')}" onclick="openLarge('${image.fields.file.url}')" />`
  }).join('')}
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
      document.querySelector(".gallerie-nomad-carousel").appendChild(img);
    });

    bios
      .sort((a, b) => {
        if (a.fields.name.includes("JCJGR")) return -1; // Ensure 'JCJGR' always comes first
        if (b.fields.name.includes("JCJGR")) return 1;  // Ensure 'JCJGR' always comes first when compared
        if (a.fields.name.includes("Ioke")) return 1; // Ensure 'Ioke' always comes last
        if (b.fields.name.includes("Ioke")) return -1; // Ensure 'Ioke' always comes last when compared
        return 0; // Keep the order of all other items
      })
      .forEach((entryItem) => {
        buildProfileCard(entryItem);
      });

    contactBlock.forEach((entryItem) => {
      buildContactCard(entryItem);
    });
  })
  .catch(console.error);

// JavaScript to scroll images
function scrollImages(direction, amount = 410) {
  var container = document.querySelector(".gallerie-nomad-carousel");
  if (container.scrollLeft === 0 && direction < 0) {
    // move to the end
    container.scrollLeft = container.scrollWidth;
    return;
  }
  if (container.scrollLeft === container.scrollWidth - container.clientWidth && direction > 0) {
    container.scrollLeft = 0;
    return;
  }
  container.scrollLeft += direction * amount; // Adjust the 100 to how many pixels you want to scroll
}

function autoScroll() {
  if (document.querySelector(".gallerie-nomad-carousel").children.length === 0) {
    // waiting to do auto scoll when there are elements in the carousel
    setTimeout(() => autoScroll(), 1000);
    return;
  }

  let autoScrollIntervals = [];
  const scrollSpeed = 50; // Adjust the speed as needed
  let autoDirection = 1;

  const startAutoScroll = () => {
    const autoScrollInterval = setInterval(() => {
      var container = document.querySelector(".gallerie-nomad-carousel");
      if (
        // container on the right edge
        container.scrollLeft === container.scrollWidth - container.clientWidth ||
        // container on the left edge
        container.scrollLeft === 0
      ) {
        autoDirection = -autoDirection;
      }
      container.scrollLeft = container.scrollLeft + 2 * autoDirection;
    }, scrollSpeed);
    autoScrollIntervals.push(autoScrollInterval)
  };

  const stopAutoScroll = () => {
    autoScrollIntervals.forEach(autoScrollInterval => clearInterval(autoScrollInterval));
  };

  const container = document.querySelector('.gallerie-image-container');

  container.addEventListener('mouseenter', () => {
    console.log('mouse enter');
    stopAutoScroll();
  });

  container.addEventListener('mouseleave', () => {
    console.log('mouse leave');
    startAutoScroll();
  });

  // Start auto-scrolling by default when the page loads
  startAutoScroll();
}

autoScroll();