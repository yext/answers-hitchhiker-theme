ANSWERS.addComponent("Pagination", Object.assign({}, {
  container: "#js-answersPagination",
  onPaginate: (newPageNumber, oldPageNumber, totalPages) => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Safari

    window.iframeLoaded.then(() => {
      const paginateMessage = { action: 'paginate' };
      window.parentIFrame.sendMessage(JSON.stringify(paginateMessage));
    });
  },
    verticalKey: "testKey",
}, {}));
