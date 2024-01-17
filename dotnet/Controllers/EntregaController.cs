using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Entregas;
using DDDSample1.Domain.Armazens;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntregaController : ControllerBase
    {
        private readonly EntregaServico _EntregaServico;

        public EntregaController(EntregaServico entregaServico)
        {
            _EntregaServico = entregaServico;

        }

        // GET: api/entrega
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EntregaDTO>>> GetAll()
        {
            return await _EntregaServico.GetAllAsync();
        }

        // GET: api/entrega/armazem/002
        [HttpGet("armazem/{id}")]
        public async Task<List<EntregaDTO>> GetByArmazemAsync(string id){
            return await _EntregaServico.GetByArmazemAsync(new ArmazemId(id));
        }


        // GET: api/entrega/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EntregaDTO>> GetGetById(String id)
        {
            var entrega = await _EntregaServico.GetByIdAsync(new EntregaId(id));

            if (entrega == null)
            {
                return NotFound();
            }

            return entrega;
        }

         // GET: api/entrega/data/
        [HttpGet("data/{data}")]
        public async Task<List<EntregaDTO>> GetByDataAsync(string data){
            return await _EntregaServico.GetByDataAsync(new string(data));
        }



        // POST: api/entrega
        [HttpPost]
        public async Task<ActionResult<EntregaDTO>> Create(EntregaDTO dto)
        {
            var entrega = await _EntregaServico.AddAsync(dto);

            return CreatedAtAction(nameof(GetGetById), new { id = entrega.Id }, entrega);

        }

        // PUT: api/armazem/5
        [HttpPut("{id}")]
        public async Task<ActionResult<EntregaDTO>> Update(String id, EntregaDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var entrega = await _EntregaServico.UpdateAsync(dto);

                if (entrega == null)
                {
                    return NotFound();
                }
                return Ok(entrega);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        // DELETE: api/entrega/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<EntregaDTO>> HardDelete(String id)
        {
            try
            {
                var entrega = await _EntregaServico.DeleteAsync(new EntregaId(id));

                if (entrega == null)
                {
                    return NotFound();
                }

                return Ok(entrega);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}