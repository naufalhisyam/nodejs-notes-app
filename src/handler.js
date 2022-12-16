const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id, title, createdAt, updatedAt, tags, body,
  };
  notes.push(newNote);

  const isSuccessful = !!notes.find((note) => note.id === id);

  if (isSuccessful) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const showAllNotesHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      notes,
    },
  });
  response.code(200);
  return response;
};

const showSpecificNoteHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.find((note) => note.id === id);

  if (note !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        note,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;

  const requestedNoteIndex = notes.findIndex((note) => note.id === id);
  const updatedAt = new Date().toISOString();

  if (requestedNoteIndex !== -1) {
    notes[requestedNoteIndex] = {
      ...notes[requestedNoteIndex], title, tags, body, updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteHandler = (request, h) => {
  const { id } = request.params;

  const requestedNoteIndex = notes.findIndex((note) => note.id === id);

  if (requestedNoteIndex !== -1) {
    notes.splice(requestedNoteIndex, 1);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler, showAllNotesHandler, showSpecificNoteHandler, editNoteHandler, deleteNoteHandler,
};
