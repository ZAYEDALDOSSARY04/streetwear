'use client'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { X, Plus, Trash2 } from 'lucide-react'

const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', '38', '39', '40', '41', '42', '43', '44', '45']

export default function AddProductModal({ onClose, onSave, currency = 'BHD' }) {
  const [saving, setSaving] = useState(false)
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '', description: '', price: '', photos: [''], styleTags: [],
      sizes: [{ label: 'S', stock: 5 }, { label: 'M', stock: 5 }, { label: 'L', stock: 5 }],
    },
  })
  const { fields: sizeFields, append: addSize, remove: removeSize } = useFieldArray({ control, name: 'sizes' })

  async function onSubmit(data) {
    setSaving(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          currency,
          photos: data.photos.filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      const product = await res.json()
      onSave(product)
    } catch {
      alert('Failed to save product. Check your details.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="font-display font-bold text-lg">Add New Product</h2>
          <button onClick={onClose} className="text-muted hover:text-primary transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          <div>
            <label className="section-label block mb-1.5">Product Name *</label>
            <input {...register('name', { required: true })} className={`input-dark ${errors.name ? 'border-red-500' : ''}`} placeholder="e.g. Chrome Reflective Bomber" />
          </div>

          <div>
            <label className="section-label block mb-1.5">Description</label>
            <textarea {...register('description')} rows={3} className="input-dark resize-none" placeholder="Describe the piece…" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-label block mb-1.5">Price ({currency}) *</label>
              <input type="number" step="0.01" {...register('price', { required: true, min: 0.01 })} className={`input-dark ${errors.price ? 'border-red-500' : ''}`} placeholder="0.00" />
            </div>
            <div>
              <label className="section-label block mb-1.5">Style Tag</label>
              <select {...register('styleTags.0')} className="input-dark">
                <option value="">None</option>
                {['Y2K', 'techwear', 'vintage', 'skate', 'luxury street'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="section-label block mb-1.5">Photo URLs (up to 5)</label>
            {[0, 1, 2, 3, 4].map(i => (
              <input key={i} {...register(`photos.${i}`)} className="input-dark mb-2" placeholder={`Photo ${i + 1} URL (picsum.photos/...)`} />
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="section-label">Sizes & Stock *</label>
              <div className="flex items-center gap-2">
                <select className="input-dark text-xs py-1 px-2 w-28" id="size-preset" defaultValue="">
                  <option value="">Add size…</option>
                  {SIZE_PRESETS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" onClick={() => {
                  const sel = document.getElementById('size-preset')
                  if (sel.value) { addSize({ label: sel.value, stock: 5 }); sel.value = '' }
                }} className="btn-ghost text-xs py-1 px-3"><Plus size={12} /></button>
              </div>
            </div>
            <div className="space-y-2">
              {sizeFields.map((field, i) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input {...register(`sizes.${i}.label`)} className="input-dark w-24" placeholder="Size" />
                  <input type="number" {...register(`sizes.${i}.stock`)} className="input-dark flex-1" placeholder="Stock" />
                  <button type="button" onClick={() => removeSize(i)} className="text-muted hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-accent flex-1">{saving ? 'Saving…' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
