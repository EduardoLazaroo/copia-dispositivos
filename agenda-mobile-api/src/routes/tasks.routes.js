const { randomUUID } = require('crypto');
const express = require('express');
const { getPool } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const priorities = new Set(['baixa', 'media', 'alta']);

function toTask(row) {
  // Normaliza formato vindo do MySQL para o contrato da API.
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    done: Boolean(row.done),
    priority: row.priority,
    dueDate: row.due_date?.toISOString() ?? undefined,
    reminderAt: row.reminder_at?.toISOString() ?? undefined,
    photoDataUrl: row.photo_data_url ?? undefined,
    latitude: row.latitude === null ? undefined : Number(row.latitude),
    longitude: row.longitude === null ? undefined : Number(row.longitude),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function validateTask(body) {
  // Validacoes minimas para manter consistencia de dominio.
  if (!body.title?.trim()) return 'O titulo da tarefa e obrigatorio.';
  if (body.priority && !priorities.has(body.priority)) return 'A prioridade deve ser baixa, media ou alta.';
  return null;
}

// Todas as rotas abaixo exigem usuario autenticado.
router.use(authenticate);

router.get('/', async (request, response, next) => {
  try {
    const [rows] = await getPool().execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [request.user.sub]);
    return response.json(rows.map(toTask));
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    const validationError = validateTask(request.body);
    if (validationError) return response.status(400).json({ message: validationError });

    // Cria id no backend para garantir unicidade por registro.
    const now = new Date();
    const task = { id: randomUUID(), ...request.body, createdAt: now, updatedAt: now };
    await getPool().execute(
      `INSERT INTO tasks (id, user_id, title, description, done, priority, due_date, reminder_at, photo_data_url, latitude, longitude, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [task.id, request.user.sub, task.title.trim(), task.description?.trim() ?? '', Boolean(task.done), task.priority ?? 'media', task.dueDate ?? null, task.reminderAt ?? null, task.photoDataUrl ?? null, task.latitude ?? null, task.longitude ?? null, task.createdAt, task.updatedAt],
    );
    const [rows] = await getPool().execute('SELECT * FROM tasks WHERE id = ?', [task.id]);
    return response.status(201).json(toTask(rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', async (request, response, next) => {
  try {
    const validationError = validateTask(request.body);
    if (validationError) return response.status(400).json({ message: validationError });

    const now = new Date();
    const [result] = await getPool().execute(
      `UPDATE tasks SET title = ?, description = ?, done = ?, priority = ?, due_date = ?, reminder_at = ?, photo_data_url = ?, latitude = ?, longitude = ?, updated_at = ?
       WHERE id = ? AND user_id = ?`,
      [request.body.title.trim(), request.body.description?.trim() ?? '', Boolean(request.body.done), request.body.priority ?? 'media', request.body.dueDate ?? null, request.body.reminderAt ?? null, request.body.photoDataUrl ?? null, request.body.latitude ?? null, request.body.longitude ?? null, now, request.params.id, request.user.sub],
    );
    if (!result.affectedRows) return response.status(404).json({ message: 'Tarefa nao encontrada.' });
    const [rows] = await getPool().execute('SELECT * FROM tasks WHERE id = ?', [request.params.id]);
    return response.json(toTask(rows[0]));
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (request, response, next) => {
  try {
    const [result] = await getPool().execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [request.params.id, request.user.sub]);
    return result.affectedRows ? response.status(204).send() : response.status(404).json({ message: 'Tarefa nao encontrada.' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
