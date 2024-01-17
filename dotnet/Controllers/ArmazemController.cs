using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Armazens;
using Microsoft.AspNetCore.JsonPatch;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArmazemController : ControllerBase
    {
        private readonly ArmazemServico _service;

        public ArmazemController(ArmazemServico service)
        {
            _service = service;
        }

        // GET: api/armazem

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArmazemDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/armazem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ArmazemDto>> GetGetById(String id)
        {
            var arm = await _service.GetByIdAsync(new ArmazemId(id));

            if (arm == null)
            {
                return NotFound();
            }

            return arm;
        }

        // POST: api/armazem
        [HttpPost]
        public async Task<ActionResult<ArmazemDto>> Create(ArmazemDto dto)
        {
            var arm = await _service.AddAsync(dto);

            return CreatedAtAction(nameof(GetGetById), new { id = arm.Id }, arm);
        }


        // PUT: api/armazem/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ArmazemDto>> Update(String id, ArmazemDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var arm = await _service.UpdateAsync(dto);

                if (arm == null)
                {
                    return NotFound();
                }
                return Ok(arm);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        // PUT: api/armazem/5
        [HttpPatch("{id}")]
        public async Task<ActionResult<ArmazemDto>> Patch(String id, [FromBody] JsonPatchDocument patchDocument)
        {
            var arm = await _service.Patch(new ArmazemId(id), patchDocument);

            if (arm == null)
            {
                return NotFound();
            }

            return Ok(arm);
        }

        // Inactivate: api/armazem/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ArmazemDto>> SoftDelete(String id)
        {


            var arm = await _service.InactivateAsync(new ArmazemId(id));

            if (arm == null)
            {
                return NotFound();
            }


            return Ok(arm);
        }

        // DELETE: api/armazem/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<ArmazemDto>> HardDelete(String id)
        {
            try
            {
                var arm = await _service.DeleteAsync(new ArmazemId(id));

                if (arm == null)
                {
                    return NotFound();
                }

                return Ok(arm);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}