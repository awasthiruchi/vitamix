export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // setup image columns
      const pic = col.querySelector('div picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('column-img');
        }
      }

      // setup button columns
      const button = col.querySelector('div .button');
      if (button && button.textContent === col.textContent) {
        button.closest('div').classList.add('column-button');
      }
    });
  });
}
