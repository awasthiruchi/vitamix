import { parseAlertBanners, findBestAlertBanner, currentPastFuture } from '../../scripts/scripts.js';

function formatShortDateTime(date) {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Convert to 12-hour format
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  if (hours === 0) hours = 12; // 12am/12pm instead of 0am/0pm

  // Format time - only show minutes if not :00
  let timeStr = `${hours}${ampm}`;
  if (minutes !== 0) {
    const paddedMinutes = minutes.toString().padStart(2, '0');
    timeStr = `${hours}:${paddedMinutes}${ampm}`;
  }

  return `${month}/${day} ${timeStr}`;
}

function createParsedBanners(banners, bestBanner = null, date = new Date()) {
  const list = document.createElement('ul');
  banners.forEach((banner) => {
    const row = document.createElement('li');
    if (bestBanner === banner) {
      row.classList.add('alert-banners-selected');
    }
    if (banner.valid) {
      row.classList.add('alert-banners-valid');
    } else {
      row.classList.add('alert-banners-invalid');
    }
    row.classList.add(`alert-banners-${currentPastFuture(banner.start, banner.end, date)}`);

    list.appendChild(row);
    row.innerHTML = `
      <div class="alert-banners-date">${formatShortDateTime(banner.start)} - ${formatShortDateTime(banner.end)}</div>
      <div class="alert-banners-content">${banner.content.innerHTML}</div>
      <div class="alert-banners-color">${banner.color.textContent}</div>
      `;
  });
  return list;
}

export default async function decorateAlertBanners(block) {
  const banners = parseAlertBanners(block);
  block.innerHTML = '';
  const bestBanner = findBestAlertBanner(banners);
  block.append(createParsedBanners(banners, bestBanner));
  // eslint-disable-next-line no-console
  console.log(banners);
  // eslint-disable-next-line no-console
  console.log(findBestAlertBanner(banners));
}
